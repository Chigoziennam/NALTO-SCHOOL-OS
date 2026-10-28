// Vercel serverless function: starts a Paystack payment for the bag.
// The browser sends only ids, sizes, quantities and delivery details. Prices live here, so a visitor can't change what they pay.
// Required env var (Vercel → Project → Settings → Environment Variables):
//   PAYSTACK_SECRET_KEY   sk_live_… (server only, never in the page)
// Keep PRICES in step with the catalogue in index.html.

const PRICES = {
  'liberty-raglan': 40000, 'ringer-tee': 22000, 'yowa-long-sleeve': 23500, 'bybd-tee': 30000, 'logo-tee': 30000,
  'joggers': 35000, 'jorts': 30000, 'skull-cap': 18000, 'cap-042': 45000
};
const NAMES = {
  'liberty-raglan': 'Liberty Raglan', 'ringer-tee': 'Ringer Tee', 'yowa-long-sleeve': 'YOWA Long Sleeve', 'bybd-tee': 'Be Different Tee',
  'logo-tee': 'YOWA Logo Tee', 'joggers': 'Joggers', 'jorts': 'Jorts', 'skull-cap': 'Skull Cap', 'cap-042': '042 Cap'
};
// Delivery tiers: Nsukka ₦3,000 · Other Enugu ₦5,000 · Other states ₦8,500.
// Collecting in person costs nothing, so a pickup order pays for the clothes alone.
const PICKUP_AT = 'Enugu';

// What is gone. The page marks these too, but the page is not the authority:
// a tab left open since before a colour sold out, or a POST straight at this
// endpoint, would otherwise sell stock that does not exist. Keep in step with
// soldOut and soldOutWhen in index.html.
const SOLD_OUT = {
  'liberty-raglan': { sizes: ['XXL'], when: [{ Colour: 'Black' }, { Colour: 'Blue' }] },
  'ringer-tee':     { sizes: ['XXL'] }
};
const isSoldOut = it => {
  const r = SOLD_OUT[it && it.id];
  if (!r) return false;
  if (it.size && (r.sizes || []).indexOf(String(it.size)) >= 0) return true;
  const o = it.opts && typeof it.opts === 'object' ? it.opts : {};
  return (r.when || []).some(w => Object.keys(w).every(k => o[k] === w[k]));
};
const calcDelivery = (state, lga, fulfil) => {
  if (fulfil === 'pickup') return 0;
  if (!state) return 0;
  if (state === 'Enugu') return lga === 'Nsukka' ? 3000 : 5000;
  return 8500;
};
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Every checkout is written to our own table the moment it starts, before the
// buyer has even paid. Paystack stays the authority on money, but it is not the
// only place the order exists: when a payment does not finish, or a key points
// at the wrong account, the buyer and what they wanted are still here to chase.
// Never let a failure here stop a sale — the payment matters more than the row.
const ORDERS_TABLE = 'yowa_orders';
async function saveOrder(row) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/' + ORDERS_TABLE, {
      method: 'POST',
      headers: {
        apikey: key, Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(row)
    });
    // A refused write resolves like any other response, so without this check a
    // lost order looks exactly like a saved one. Never throw — the payment
    // matters more than the row — but never stay quiet about it either.
    if (!r.ok) console.error('yowa: ' + ORDERS_TABLE + ' write refused, HTTP ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 200));
  } catch (e) { console.error('yowa: ' + ORDERS_TABLE + ' write failed, ' + e.message); }
}

// Where Paystack sends the buyer once they have paid.
//
// Pinned to one known-good host rather than taken from the request. It used to
// be read from the host the buyer arrived on, with a custom domain allowed — and
// that domain is suspended at the registrar and resolves nowhere, which is
// exactly how a buyer once paid 40,000 naira and landed on a dead page holding
// a receipt they never saw. A buyer who reaches the shop through a host that
// later dies must still come back somewhere that is alive.
//
// If the custom domain is ever fixed and should take the returns, this is the
// one line to change — and the host must be confirmed resolving first.
const RETURN_TO = 'https://yowabybd.vercel.app';
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'Payments are not switched on yet' });

  const b = req.body || {};
  const email = clip(b.email, 160).toLowerCase(), name = clip(b.name, 80), phone = clip(b.phone, 30);
  // Delivery only. Collecting in person is no longer offered, and a request that
  // still asked for it would pay no delivery fee and give no address to send to.
  const fulfil = 'delivery';
  const pickup = false;
  const state = pickup ? 'Pickup' : clip(b.state, 60);
  const lga = pickup ? '' : clip(b.lga, 60);
  const address = pickup ? ('Collecting in ' + PICKUP_AT) : clip(b.address, 240);
  if (!EMAIL.test(email) || !name || !phone) return res.status(400).json({ error: 'Name, email and phone are needed' });
  if (!pickup && (!state || !address)) return res.status(400).json({ error: 'State and street address are needed for delivery' });

  const items = Array.isArray(b.items) ? b.items.slice(0, 30) : [];
  let total = 0; const lines = [];
  for (const it of items) {
    const price = PRICES[it && it.id], qty = Math.floor(Number(it && it.qty));
    if (!price || !(qty >= 1 && qty <= 20)) return res.status(400).json({ error: 'Something in the cart is no longer available' });
    if (isSoldOut(it)) return res.status(409).json({ error: 'The ' + NAMES[it.id] + ' is sold out in that choice. Pick another and try again.' });
    total += price * qty;
    const pick = it.opts && typeof it.opts === 'object' ? Object.values(it.opts).map(v => clip(String(v), 40)).filter(Boolean).join(', ') : '';
    lines.push(qty + ' x ' + NAMES[it.id] + (it.size && it.size !== 'One size' ? ' / ' + clip(it.size, 8) : '') + (pick ? ' / ' + pick : ''));
  }
  if (!lines.length) return res.status(400).json({ error: 'The cart is empty' });

  const delivery = calcDelivery(state, lga, fulfil);
  const grand = total + delivery;
  const deliveryLabel = pickup ? ('Pickup, ' + PICKUP_AT) : (state === 'Enugu' ? (lga ? lga + ', Enugu' : 'Enugu') : state);
  const deliverTo = pickup ? (name + ' — collecting in ' + PICKUP_AT) : [name, address, lga, state].filter(Boolean).join(', ');
  const feeLabel = pickup ? ('None — pickup in ' + PICKUP_AT) : ('₦' + delivery.toLocaleString('en-NG') + ' (' + deliveryLabel + ')');

  try {
    const r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, amount: grand * 100, currency: 'NGN',
        callback_url: RETURN_TO + '/',
        metadata: {
          name, phone, address, state, lga, fulfil,
          order: lines.join(' | '),
          custom_fields: [
            { display_name: 'Order', variable_name: 'order', value: lines.join(' | ') },
            { display_name: pickup ? 'Pickup' : 'Deliver to', variable_name: 'address', value: deliverTo },
            { display_name: 'Delivery fee', variable_name: 'delivery', value: feeLabel }
          ]
        }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.status || !j.data) {
      // Paystack always says why, in j.message — a revoked key, an account not
      // yet live, an amount below the minimum. Discarding it made all of those
      // one indistinguishable 502, which is how a broken shop stays broken:
      // nobody, buyer or owner, can see which of them it is.
      const why = clip(j && j.message, 200) || ('HTTP ' + r.status);
      console.error('yowa: paystack initialize refused, HTTP ' + r.status + ', ' + why);
      return res.status(502).json({ error: 'Paystack could not start the payment', reason: why });
    }

    await saveOrder({
      reference: j.data.reference,
      status: 'pending',
      amount: grand, subtotal: total, delivery_fee: delivery,
      fulfil, name, email, phone, address, state, lga,
      items: lines.join(' | ')
    });

    return res.status(200).json({ url: j.data.authorization_url, reference: j.data.reference, delivery, fulfil });
  } catch (e) {
    return res.status(500).json({ error: 'Checkout failed' });
  }
}

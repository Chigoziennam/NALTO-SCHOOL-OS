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
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'Payments are not switched on yet' });

  const b = req.body || {};
  const email = clip(b.email, 160).toLowerCase(), name = clip(b.name, 80), phone = clip(b.phone, 30), address = clip(b.address, 240);
  if (!EMAIL.test(email) || !name || !phone || !address) return res.status(400).json({ error: 'Name, email, phone and delivery address are needed' });

  const items = Array.isArray(b.items) ? b.items.slice(0, 30) : [];
  let total = 0; const lines = [];
  for (const it of items) {
    const price = PRICES[it && it.id], qty = Math.floor(Number(it && it.qty));
    if (!price || !(qty >= 1 && qty <= 20)) return res.status(400).json({ error: 'Something in the cart is no longer available' });
    total += price * qty;
    const pick = it.opts && typeof it.opts === 'object' ? Object.values(it.opts).map(v => clip(String(v), 40)).filter(Boolean).join(', ') : '';
    lines.push(qty + ' x ' + NAMES[it.id] + (it.size && it.size !== 'One size' ? ' / ' + clip(it.size, 8) : '') + (pick ? ' / ' + pick : ''));
  }
  if (!lines.length) return res.status(400).json({ error: 'The cart is empty' });

  try {
    const r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, amount: total * 100, currency: 'NGN',
        callback_url: 'https://yowabybd.com/',
        metadata: { name, phone, address, order: lines.join(' | '), custom_fields: [{ display_name: 'Order', variable_name: 'order', value: lines.join(' | ') }, { display_name: 'Deliver to', variable_name: 'address', value: address }] }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.status || !j.data) return res.status(502).json({ error: 'Paystack could not start the payment' });
    return res.status(200).json({ url: j.data.authorization_url, reference: j.data.reference });
  } catch (e) {
    return res.status(500).json({ error: 'Checkout failed' });
  }
}

// Vercel serverless function: confirms with Paystack that a payment really went through.
// Needs PAYSTACK_SECRET_KEY, the same as /api/checkout.

// Paystack is the authority on whether money moved; this writes that verdict
// back onto our own row so the board does not depend on reaching Paystack.
const ORDERS_TABLE = 'yowa_orders';
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
async function markOrder(ref, patch) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/' + ORDERS_TABLE + '?reference=eq.' + encodeURIComponent(ref), {
      method: 'PATCH',
      headers: {
        apikey: key, Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json', Prefer: 'return=minimal'
      },
      body: JSON.stringify(patch)
    });
    // Same trap as the write: a refusal resolves, so say so rather than letting
    // a paid order sit in our table marked pending forever.
    if (!r.ok) console.error('yowa: ' + ORDERS_TABLE + ' update refused, HTTP ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 200));
  } catch (e) { console.error('yowa: ' + ORDERS_TABLE + ' update failed, ' + e.message); }
}

export default async function handler(req, res) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const ref = String((req.query && req.query.reference) || '').replace(/[^\w.-]/g, '').slice(0, 80);
  if (!secret) return res.status(503).json({ error: 'Payments are not switched on yet' });
  if (!ref) return res.status(400).json({ error: 'No reference' });
  try {
    const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref), { headers: { Authorization: 'Bearer ' + secret } });
    const j = await r.json().catch(() => ({}));
    // Paystack saying "this payment failed" and Paystack refusing to answer us
    // are not the same answer, and the difference is somebody's money. Without
    // this check a dead key made j.data undefined, which read as status
    // 'failed' — so a buyer who had genuinely paid was shown an unpaid screen
    // AND had their order overwritten as failed in our own table, destroying
    // the only record that they were owed anything. Never write a verdict we
    // did not actually receive.
    if (!r.ok || !j.status || !j.data) {
      const why = clip(j && j.message, 200) || ('HTTP ' + r.status);
      console.error('yowa: paystack verify refused for ' + ref + ', HTTP ' + r.status + ', ' + why);
      return res.status(502).json({ error: 'We could not reach Paystack to confirm this payment', reason: why });
    }
    const d = j.data;
    const m = d.metadata || {};
    const paid = d.status === 'success';
    await markOrder(ref, paid
      ? { status: 'success', paid_at: d.paid_at || new Date().toISOString(), amount: Math.round((Number(d.amount) || 0) / 100) }
      : { status: String(d.status || 'failed').slice(0, 24) });
    if (!paid) return res.status(200).json({ paid: false });
    return res.status(200).json({
      paid: true,
      reference: String(d.reference || ref),
      amount: Math.round((Number(d.amount) || 0) / 100),   // kobo to naira
      name: typeof m.name === 'string' ? m.name : '',
      order: typeof m.order === 'string' ? m.order : '',
      fulfil: m.fulfil === 'pickup' ? 'pickup' : 'delivery'
    });
  } catch (e) {
    return res.status(500).json({ error: 'Could not check the payment' });
  }
}

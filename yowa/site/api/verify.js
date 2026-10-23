// Vercel serverless function: confirms with Paystack that a payment really went through.
// Needs PAYSTACK_SECRET_KEY, the same as /api/checkout.

export default async function handler(req, res) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const ref = String((req.query && req.query.reference) || '').replace(/[^\w.-]/g, '').slice(0, 80);
  if (!secret) return res.status(503).json({ error: 'Payments are not switched on yet' });
  if (!ref) return res.status(400).json({ error: 'No reference' });
  try {
    const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref), { headers: { Authorization: 'Bearer ' + secret } });
    const j = await r.json().catch(() => ({}));
    const d = (j && j.data) || {};
    const m = d.metadata || {};
    const paid = d.status === 'success';
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

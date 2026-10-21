// Vercel serverless function: marks one order delivered, or takes the mark back off.
// Paystack metadata is fixed once a payment starts, so the delivered flag lives in Supabase.
// Same env vars as /api/orders; see that file for the `deliveries` table.

import { passwordOk, supabaseKey } from './orders.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  const given = (req.headers && req.headers['x-admin-key']) || b.password || '';
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'No ADMIN_PASSWORD is set, so the dashboard stays shut' });
  if (!passwordOk(given)) return res.status(401).json({ error: 'Wrong passcode' });

  const url = process.env.SUPABASE_URL, key = supabaseKey();
  if (!url || !key) return res.status(503).json({ error: 'Delivered marks need SUPABASE_URL and SUPABASE_SERVICE_KEY' });

  const reference = String(b.reference || '').replace(/[^\w.-]/g, '').slice(0, 80);
  if (!reference) return res.status(400).json({ error: 'No reference' });
  const delivered = b.delivered !== false;
  const base = url.replace(/\/$/, '') + '/rest/v1/deliveries';
  const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };

  try {
    const r = delivered
      ? await fetch(base, {
          method: 'POST',
          headers: Object.assign({}, headers, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
          body: JSON.stringify({ reference, delivered_at: new Date().toISOString() })
        })
      : await fetch(base + '?reference=eq.' + encodeURIComponent(reference), { method: 'DELETE', headers });
    if (!r.ok) return res.status(502).json({ error: 'Supabase refused the change' });
    return res.status(200).json({ ok: true, reference, delivered });
  } catch (e) {
    return res.status(500).json({ error: 'Could not save the change' });
  }
}

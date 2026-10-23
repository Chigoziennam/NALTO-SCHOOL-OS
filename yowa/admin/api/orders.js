// Vercel serverless function: the orders behind the admin board.
// Paystack is the record of what was bought — /api/checkout writes the buyer's name, phone,
// address, state and order lines into each transaction's metadata, so everything the
// dashboard shows is read back from there. Supabase only holds which orders have been
// delivered, because Paystack metadata cannot be changed after a payment starts.
//
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   ADMIN_PASSWORD        the passcode /admin asks for. Without it this route serves nothing.
//   PAYSTACK_SECRET_KEY   the same key /api/checkout uses
// Optional, switches on the delivered marks:
//   SUPABASE_URL          the project URL, as /api/join uses
//   SUPABASE_SERVICE_KEY  a key allowed to read and write the `deliveries` table
//
//   create table deliveries (
//     reference text primary key,
//     delivered_at timestamptz not null default now()
//   );

import crypto from 'crypto';

const sha = s => crypto.createHash('sha256').update(String(s == null ? '' : s)).digest();

// Constant time, and constant length whatever the guess, so nothing leaks about the passcode.
export function passwordOk(given) {
  const want = process.env.ADMIN_PASSWORD || '';
  if (!want) return false;              // no passcode set — refuse rather than expose buyers
  return crypto.timingSafeEqual(sha(given), sha(want));
}

export function supabaseKey() {
  return process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
}

// Every delivered reference, or null when Supabase is not reachable for it
async function fetchDelivered() {
  const url = process.env.SUPABASE_URL, key = supabaseKey();
  if (!url || !key) return null;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/deliveries?select=reference,delivered_at', {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    });
    if (!r.ok) return null;
    const rows = await r.json();
    if (!Array.isArray(rows)) return null;
    const map = {};
    rows.forEach(row => { if (row && row.reference) map[row.reference] = row.delivered_at || true; });
    return map;
  } catch (e) {
    return null;
  }
}

// Paystack pages at 100; three pages covers far more than this shop will see in a season.
// No status filter: a buyer whose payment did not reach `success` still needs finding.
async function fetchPaid(secret) {
  const out = [];
  for (let page = 1; page <= 3; page++) {
    const r = await fetch('https://api.paystack.co/transaction?perPage=100&page=' + page, {
      headers: { Authorization: 'Bearer ' + secret }
    });
    if (!r.ok) break;
    const j = await r.json().catch(() => ({}));
    const rows = (j && j.data) || [];
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

const str = v => (typeof v === 'string' ? v : v == null ? '' : String(v));

export default async function handler(req, res) {
  const given = (req.headers && req.headers['x-admin-key']) || (req.body && req.body.password) || '';
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'No ADMIN_PASSWORD is set, so the dashboard stays shut' });
  if (!passwordOk(given)) return res.status(401).json({ error: 'Wrong passcode' });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'PAYSTACK_SECRET_KEY is missing' });

  try {
    const [rows, delivered] = await Promise.all([fetchPaid(secret), fetchDelivered()]);
    const orders = rows.map(t => {
      const m = (t && t.metadata) || {};
      return {
        reference: str(t.reference),
        paidAt: str(t.paid_at || t.createdAt || t.created_at),
        amount: Math.round((Number(t.amount) || 0) / 100),   // kobo → naira
        email: str((t.customer && t.customer.email) || m.email),
        name: str(m.name),
        phone: str(m.phone),
        address: str(m.address),
        state: str(m.state),
        lga: str(m.lga),
        order: str(m.order),
        status: str(t.status) || 'unknown',
        paid: t.status === 'success',
        fulfil: m.fulfil === 'pickup' ? 'pickup' : 'delivery',
        delivered: !!(delivered && delivered[str(t.reference)])
      };
    }).sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)));

    return res.status(200).json({
      orders,
      deliveryTracking: delivered !== null,
      deliveryNote: delivered === null
        ? 'Delivered marks need SUPABASE_URL and SUPABASE_SERVICE_KEY, and a `deliveries` table. Everything else below is live.'
        : ''
    });
  } catch (e) {
    return res.status(500).json({ error: 'Could not read the orders' });
  }
}

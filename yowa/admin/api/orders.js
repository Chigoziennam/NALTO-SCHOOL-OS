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
async function fetchPaid(secret, report) {
  const out = [];
  for (let page = 1; page <= 3; page++) {
    const r = await fetch('https://api.paystack.co/transaction?perPage=100&page=' + page, {
      headers: { Authorization: 'Bearer ' + secret }
    });
    if (!r.ok) {
      if (report && page === 1) {
        report.error = r.status === 401
          ? 'Paystack rejected this key (401). The admin PAYSTACK_SECRET_KEY is wrong, or belongs to a different account or mode than the shop charges on.'
          : 'Paystack refused the request (HTTP ' + r.status + ').';
      }
      break;
    }
    const j = await r.json().catch(() => ({}));
    const rows = (j && j.data) || [];
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

const str = v => (typeof v === 'string' ? v : v == null ? '' : String(v));

// Our own record of every checkout, written when the buyer starts paying.
// Paystack can only be asked about money it holds under the key we happen to
// have; this table holds the order itself, so a sale is never lost to a wrong
// key, a changed mode, or a payment that stopped half way.
const ORDERS_TABLE = 'yowa_orders';
// Opening day in Enugu — the point from which the shop should have been
// recording every checkout into Supabase.
const OPENED = '2026-10-23';
const dayKey = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d).forEach(x => { if (x.type !== 'literal') p[x.type] = x.value; });
  return p.year + '-' + p.month + '-' + p.day;
};

async function fetchSaved() {
  const url = process.env.SUPABASE_URL, key = supabaseKey();
  if (!url || !key) return null;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/' + ORDERS_TABLE +
      '?select=*&order=created_at.desc&limit=300', {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    });
    if (!r.ok) return null;
    const rows = await r.json();
    return Array.isArray(rows) ? rows : null;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  const given = (req.headers && req.headers['x-admin-key']) || (req.body && req.body.password) || '';
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'No ADMIN_PASSWORD is set, so the dashboard stays shut' });
  if (!passwordOk(given)) return res.status(401).json({ error: 'Wrong passcode' });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'PAYSTACK_SECRET_KEY is missing' });

  try {
    const paystack = {};
    const [rows, delivered, saved] = await Promise.all([fetchPaid(secret, paystack), fetchDelivered(), fetchSaved()]);
    const fromPaystack = rows.map(t => {
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
    });

    // Merge the two by reference. Paystack wins on money and status, because it
    // is the one that actually took it; our table fills in everything Paystack
    // never saw, including checkouts that never reached it at all.
    const byRef = {};
    (saved || []).forEach(row => {
      const ref = str(row.reference);
      if (!ref) return;
      byRef[ref] = {
        reference: ref,
        paidAt: str(row.paid_at || row.created_at),
        amount: Math.round(Number(row.amount) || 0),
        email: str(row.email), name: str(row.name), phone: str(row.phone),
        address: str(row.address), state: str(row.state), lga: str(row.lga),
        order: str(row.items),
        status: str(row.status) || 'pending',
        paid: row.status === 'success',
        fulfil: row.fulfil === 'pickup' ? 'pickup' : 'delivery',
        delivered: !!(delivered && delivered[ref]),
        source: 'saved'
      };
    });
    fromPaystack.forEach(o => {
      byRef[o.reference] = Object.assign({}, byRef[o.reference] || {}, o, {
        source: byRef[o.reference] ? 'both' : 'paystack'
      });
    });
    const orders = Object.values(byRef)
      .sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)));

    // The shop writes every checkout to our own table before the buyer even
    // reaches Paystack. That write failing is silent by nature — a shop with no
    // sales and a shop whose rows are being refused look identical — so compare
    // the two sources here and say so out loud. Only transactions from opening
    // day on are counted: anything older predates the table.
    const savedRefs = new Set((saved || []).map(r => str(r.reference)).filter(Boolean));
    const recent = fromPaystack.filter(o => o.paidAt && dayKey(o.paidAt) >= OPENED);
    const missing = recent.filter(o => !savedRefs.has(o.reference)).length;
    const savedNote = saved === null
      ? 'Supabase could not be read, so this board is running on Paystack alone. Nothing is being recorded independently.'
      : missing
        ? missing + ' of ' + recent.length + ' transactions since opening never reached Supabase. The shop cannot write to ' +
          ORDERS_TABLE + ' — set SUPABASE_SERVICE_KEY on the yowa project. Until then Paystack is the only copy.'
        : '';

    return res.status(200).json({
      orders,
      savedOrders: saved === null ? null : saved.length,
      savedMissing: missing,
      savedNote,
      paystackOrders: fromPaystack.length,
      paystackError: paystack.error || '',
      deliveryTracking: delivered !== null,
      deliveryNote: delivered === null
        ? 'Delivered marks need SUPABASE_URL and SUPABASE_SERVICE_KEY, and a `deliveries` table. Everything else below is live.'
        : ''
    });
  } catch (e) {
    return res.status(500).json({ error: 'Could not read the orders' });
  }
}

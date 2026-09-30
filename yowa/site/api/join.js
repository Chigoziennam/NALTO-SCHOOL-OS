// Vercel serverless function: adds a sign-up to the Supabase `waitlist` table.
// Keeps the Supabase key on the server instead of in the page source.
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   SUPABASE_URL        e.g. https://emclkprkvzrbqmwbbwqu.supabase.co
//   SUPABASE_ANON_KEY   the project's anon key (the table only allows inserts for anon)

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Supabase is not configured' });

  const b = req.body || {};
  const row = {
    name: clip(b.name, 80),
    email: clip(b.email, 160).toLowerCase(),
    size: SIZES.includes(b.size) ? b.size : null,
    instagram: clip(b.instagram, 60) || null
  };
  if (!row.name || !EMAIL.test(row.email)) return res.status(400).json({ error: 'Name and a valid email are required' });

  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/waitlist', {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row)
    });
    // 409 means the email is already on the list, which is a success for the fan.
    if (r.ok || r.status === 409) return res.status(200).json({ ok: true });
    return res.status(502).json({ error: 'Could not save the sign-up' });
  } catch (e) {
    return res.status(500).json({ error: 'Sign-up failed' });
  }
}

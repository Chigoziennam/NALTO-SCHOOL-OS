// Vercel serverless function: "Chloe", the AI business advisor on the YOWA admin board.
// She sees live order metrics and gives the owner actionable advice.
//
// Required env vars:
//   ADMIN_PASSWORD        same passcode the board uses
//   PAYSTACK_SECRET_KEY   reads orders to build Chloe's context
//   OPENROUTER_API_KEY    powers the chat via OpenRouter

import { passwordOk } from './orders.js';

const piecesIn = s => String(s || '').split('|').reduce((n, part) => {
  const m = part.trim().match(/^(\d+)\s*x\s/i);
  return n + (m ? parseInt(m[1], 10) : 0);
}, 0);

const str = v => (typeof v === 'string' ? v : v == null ? '' : String(v));

async function fetchPaid(secret) {
  const out = [];
  for (let page = 1; page <= 3; page++) {
    const r = await fetch('https://api.paystack.co/transaction?status=success&perPage=100&page=' + page, {
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

function buildMetrics(rows) {
  const orders = rows.map(t => {
    const m = (t && t.metadata) || {};
    return {
      paidAt: str(t.paid_at || t.createdAt || t.created_at),
      amount: Math.round((Number(t.amount) || 0) / 100),
      state: str(m.state),
      order: str(m.order),
    };
  });

  const rev = orders.reduce((s, o) => s + o.amount, 0);
  const pcs = orders.reduce((s, o) => s + piecesIn(o.order), 0);

  const byState = {};
  orders.forEach(o => {
    const k = o.state || 'Unknown';
    byState[k] = byState[k] || { rev: 0, n: 0 };
    byState[k].rev += o.amount;
    byState[k].n++;
  });
  const stateRank = Object.entries(byState)
    .sort((a, b) => b[1].rev - a[1].rev)
    .slice(0, 8)
    .map(([name, v]) => `${name}: ₦${v.rev.toLocaleString()} (${v.n})`);

  const items = {};
  orders.forEach(o => {
    String(o.order || '').split('|').forEach(part => {
      const m = part.trim().match(/^(\d+)\s*x\s+(.+)/i);
      if (m) {
        const nm = m[2].replace(/\s*\/\s*.+$/, '').trim();
        items[nm] = (items[nm] || 0) + parseInt(m[1], 10);
      }
    });
  });
  const topItems = Object.entries(items).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const now = new Date();
  const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const mOrders = orders.filter(o => o.paidAt && new Date(o.paidAt) >= mStart);
  const mRev = mOrders.reduce((s, o) => s + o.amount, 0);
  const elapsed = now.getDate();
  const inMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const weekAgo = new Date(now - 7 * 86400000);
  const wOrders = orders.filter(o => o.paidAt && new Date(o.paidAt) >= weekAgo);
  const wRev = wOrders.reduce((s, o) => s + o.amount, 0);

  return `LIVE METRICS (${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}):
Total revenue: ₦${rev.toLocaleString()} from ${orders.length} orders
Average order: ₦${orders.length ? Math.round(rev / orders.length).toLocaleString() : '0'}
Pieces sold: ${pcs}
Last 7 days: ${wOrders.length} orders, ₦${wRev.toLocaleString()}
This month: ₦${mRev.toLocaleString()} over ${elapsed} days → projected ₦${(mRev > 0 ? Math.round(mRev / elapsed * inMonth) : 0).toLocaleString()}
States: ${stateRank.join(' · ') || 'none yet'}
Top items: ${topItems.map(([n, q]) => `${n} ×${q}`).join(', ') || 'none yet'}`;
}

const SYSTEM = `You are Chloe, the AI business advisor on the YOWA admin dashboard. You are sharp, warm, and direct — like a COO who genuinely cares about the brand succeeding.

ABOUT YOWA
YOWA is a Nigerian streetwear brand, handmade in small limited runs. Mantra: Be You Be Different. Owned by Yvng Mike and his brother. Based in Enugu, Nigeria.
Products and retail prices (naira): Liberty Raglan ₦40,000 · Ringer Tee ₦22,000 · White Long Sleeve ₦23,500 · Be Different Tee ₦30,000 · YOWA Logo Tee ₦30,000 · Joggers ₦35,000 · Jorts ₦30,000 · Skull Cap ₦18,000 · 042 Cap ₦45,000.
Delivery fees: Nsukka ₦3,000 · Other Enugu ₦5,000 · Other Nigerian states ₦8,500.

HOW TO RESPOND
- Ground every answer in the live data below. Never invent numbers.
- Be direct and actionable. When you see a problem, name it and say what to do.
- For "how to improve" questions, give numbered actions ranked by likely impact.
- Keep it concise: 2-4 sentences for quick questions, a short structured answer for strategy ones.
- Use ₦ for naira. Format large numbers readably.
- If you genuinely cannot answer from the data, say so in one line.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const given = (req.headers && req.headers['x-admin-key']) || '';
  if (!passwordOk(given)) return res.status(401).json({ error: 'Wrong passcode' });

  const orKey = process.env.OPENROUTER_API_KEY;
  if (!orKey) return res.status(503).json({ error: 'OPENROUTER_API_KEY is not set' });

  const raw = (req.body && Array.isArray(req.body.messages)) ? req.body.messages : [];
  const messages = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (!messages.length) return res.status(400).json({ error: 'No message' });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  let metrics = 'No Paystack key — cannot read live data.';
  if (secret) {
    try {
      const rows = await fetchPaid(secret);
      metrics = buildMetrics(rows);
    } catch (e) {
      metrics = 'Could not fetch live data right now.';
    }
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${orKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'https://yowa-admin.vercel.app',
        'X-Title': 'YOWA Admin Chloe'
      },
      body: JSON.stringify({
        models: ['anthropic/claude-haiku-4.5', 'google/gemini-2.5-flash'],
        messages: [{ role: 'system', content: SYSTEM + '\n\n' + metrics }, ...messages],
        max_tokens: 500,
        temperature: 0.5
      })
    });
    const data = await r.json();
    const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!r.ok || !reply) return res.status(502).json({ error: 'No reply from the model' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ reply: String(reply).trim() });
  } catch (e) {
    return res.status(500).json({ error: 'Chat failed' });
  }
}

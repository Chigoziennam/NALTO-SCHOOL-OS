// Vercel serverless function: "Ask YOWA", powered by OpenRouter.
// Required env var (Vercel → Project → Settings → Environment Variables):
//   OPENROUTER_API_KEY   your OpenRouter key (stays on the server, never in the browser)
// Optional:
//   SITE_URL             e.g. https://yowa.vercel.app (sent to OpenRouter as the referer)

const SYSTEM = `You are "Ask YOWA", the assistant for YOWA, a handmade streetwear label.
Mantra: Be You Be Different 💜⚔️🐉 (BYBD). Whenever you write the mantra, add those three emojis after it. Instagram: @yowa_bybd. Codes: 💜⚔️🐉 and 042.
Drop 01: raglan long sleeves (XS to XXL, relaxed body), the 042 cap (one size) and skull caps (one size).
Everything is handmade in limited runs. When the run is gone, it's gone.
The shop is locked until the drop. People on the list (email sign-up, "Get the code" on the site) get the code first,
plus an early-bird discount and a first look at styling.
Prices and the drop date go to the list first. If you do not know a price, date, stock level or order status, say so plainly
and point people to the list or to Instagram @yowa_bybd for a person. Never invent prices, stock, dates or order details.
Keep replies under 80 words, warm and confident. Reply in the customer's language, Nigerian Pidgin included.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(503).json({ error: 'OPENROUTER_API_KEY is not set' });

  const raw = (req.body && Array.isArray(req.body.messages)) ? req.body.messages : [];
  const messages = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (!messages.length) return res.status(400).json({ error: 'No message' });

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'https://yowa.vercel.app',
        'X-Title': 'YOWA'
      },
      body: JSON.stringify({
        // First model is primary; OpenRouter falls back to the next if it is unavailable.
        models: ['anthropic/claude-haiku-4.5', 'google/gemini-2.5-flash'],
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
        max_tokens: 300,
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

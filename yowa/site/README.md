# YOWA main site

Static site (HTML + one serverless function), deploys on Vercel like the waitlist.

## Photos: drop these into `img/` (any size, JPG)
| File | Used for |
|---|---|
| `skateboard.jpg` | Main hero background (moves with the swirl running through it) |
| `raglan-1.jpg`, `raglan-2.jpg`, `raglan-3.jpg` | Raglan Long Sleeve (2nd photo shows on hover) |
| `cap-1.jpg` … `cap-3.jpg` | 042 Cap |
| `skullcap-1.jpg` … `skullcap-3.jpg` | Skull Cap |
| `gallery-1.jpg` … `gallery-8.jpg` | "In real life" gallery |
| celeb photos, any name | Set in `CELEBS` at the top of the script in `index.html` |

Missing photos fall back to the swirl + line drawings, so the site never looks broken.

## Edit at the top of the `<script>` in index.html
- `CONFIG.DROP_AT`: drop date and time, starts the countdown (e.g. `'2026-10-17T18:00:00+01:00'`)
- `CONFIG.CODE`: the drop code the list receives
- `PRODUCTS[].price`: naira prices (`null` shows "Price drops soon")
- `CELEBS`: name, what they wore, IG post link, photo

## Vercel
- Root directory: `yowa/site`
- Env var `OPENROUTER_API_KEY` for the Ask YOWA chat (`api/chat.js`)
- Sign-ups write to the same Supabase `waitlist` table as the waitlist site (insert-only anon key)

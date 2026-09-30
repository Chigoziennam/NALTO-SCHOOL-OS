# YOWA main site

Static site (HTML + two serverless functions), deploys on Vercel like the waitlist.

## Photos
| Where | Used for |
|---|---|
| `img/skateboard.jpg` | Main hero background, first slide (moves with the swirl running through it). Not added yet |
| `img/look-*.jpg`, `img/detail-*.jpg`, `img/raglan-*.jpg` | Hero slides, the "In real life" gallery, the blue and red raglans |
| `img/library/` | Every photo from yowa-library (shoot 01), 1600px. `img/library/t/` holds the small copies the grids and cards load |
| `img/motion/` | Motion clips made with Higgsfield from library photos, each as `.mp4` (Safari) and a smaller `.webm` (Chrome, Firefox, Android) |
| celeb photos, any name | Set in `CELEBS` at the top of the script in `index.html` |

Missing photos fall back to the swirl + line drawings, so the site never looks broken.

## Library
- `LIBRARY` in the script lists every photo: file, size, caption, shelf (Streets, Campaign, Caps, Skull caps, Crew) and the product it shows (adds "Shop this piece" in the viewer). Numbers (YW·001…) follow the list order, so add new photos at the end.
- `CONFIG.LIBRARY_FEED` reads `https://yowa-library.vercel.app/api/photos`. A photo filed there in any folder except `brand` and `inbox` joins the Library on its own, straight from Supabase storage, with its caption and a shelf picked from its tags. Leaving a photo in `inbox` keeps it off the site. Set the feed to `''` to turn this off.

## Motion
- Hero: `img/motion/jump.mp4` plays over `img/library/yowa-1496.jpg` (set in `CONFIG.HERO_SLIDES` with `video` and `hold`).
- Manifesto: `img/motion/crew.mp4` plays behind the message (`data-video` on its `.photo-bg`).
- Clips start on the photo's own frame, loop without a cut, only play while on screen, and are skipped with reduced motion or data saver (the photo shows instead).

## Edit at the top of the `<script>` in index.html
- `CONFIG.DROP_AT`: drop date and time, starts the countdown (e.g. `'2026-10-17T18:00:00+01:00'`)
- `CONFIG.CODE`: the drop code the list receives
- `PRODUCTS[].price`: naira prices (`null` shows "Price drops soon")
- `CELEBS`: name, what they wore, IG post link, photo

## Vercel
- Root directory: `yowa/site`
- Env var `OPENROUTER_API_KEY` for the Ask YOWA chat (`api/chat.js`)
- Env vars `SUPABASE_URL` and `SUPABASE_ANON_KEY` for sign-ups (`api/join.js`). They write to the same Supabase `waitlist` table as the waitlist site, and the key stays on the server. Formspree still gets a copy either way.

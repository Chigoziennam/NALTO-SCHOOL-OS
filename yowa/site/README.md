# YOWA main site

Static site (HTML + two serverless functions), deploys on Vercel like the waitlist. Built for phones first: everything below works by touch, and the desktop layout is the same site with more room.

## Photos and their codes
Every photo has a fixed code, written next to it in `LIBRARY` at the top of the script in `index.html` (`no: 'YW·010'`). Codes never shift when photos are added or moved. A new photo goes at the end of the list with the next free code (the last one is YW·054).

| Where | Photo |
|---|---|
| Hero slideshow, in order | YW·054 the skateboard kickflip (`img/library/yowa-skate.jpg`), YW·010 the crew, YW·033 the black raglan, YW·042 red and black |
| Message background | YW·010, with its motion clip `img/motion/crew.mp4` |
| Worn by background | YW·042 |
| The list background | YW·033 |
| `img/look-*.jpg`, `img/detail-*.jpg`, `img/raglan-*.jpg` | The "In real life" gallery and the product photos |
| `img/library/` | Every photo, 1600px. `img/library/t/` holds the small copies the grids and cards load |
| `img/share.jpg` | The card WhatsApp, X and iMessage show when someone shares the link |

The hero slides are set in `CONFIG.HERO_SLIDES`: `no` (the code), `src`, `cap` (the short caption), `pos` (which part of the photo stays in frame on a phone). Optional: `hold` (ms on screen), `video` (a looping clip over the photo).

## Library
- `LIBRARY` lists every photo: code, file, size, caption, shelf (Streets, Campaign, Caps, Skull caps, Crew) and the product it shows (adds "Shop this piece" in the viewer).
- Any photo can be shared with its own link, like `yowabybd.com/#yw-010`. It opens straight in the viewer, and the Share button in the viewer sends that link.
- `CONFIG.LIBRARY_FEED` reads `https://yowa-library.vercel.app/api/photos`. A photo filed there in any folder except `brand` and `inbox` joins the Library on its own, numbered after the highest code. Leaving a photo in `inbox` keeps it off the site. Set the feed to `''` to turn this off.

## How it moves
- **Hero:** works like a story. The bars fill while a photo is up. Tap the right side for the next, the left for the last, swipe, or hold to pause and clear the text off the photo. Tap the code in the corner to open that photo in the Library. On Android the photo leans as the phone tilts.
- **Glitch:** photos tear, split red and cyan, drop out for a frame and snap back. It happens when the hero changes photo, now and then mid-photo, when photos scroll into view and in the viewer.
- **Dragons:** the three serpent ribbons between sections. Each one's words are its `data-text` in the HTML. They slither, and thrash when you scroll fast. Sections fade at their edges, so none of them ends on a straight line.
- **Signature:** top left. It writes itself on load, and again when tapped (which also goes back to the top).
- Everything still and calm when the phone is set to reduce motion. Motion clips are skipped on data saver.

## Phone details
- The back button closes the menu, a product, the bag, the chat or the viewer instead of leaving the site.
- Products open as a bottom sheet. Drag its handle down to put it away.
- The header slides away while you scroll down and comes back when you scroll up. The thin line on top shows how far down the page you are.
- Vibration on unlock, a wrong code, add to bag and joining the list (Android).
- Add to Home Screen gives a YOWA app icon (`manifest.webmanifest`, icons in `img/brand/`).
- "Be You Be Different" always carries 💜⚔️🐉, on the page and in Ask YOWA's replies.

## Edit at the top of the `<script>` in index.html
- `CONFIG.DROP_AT`: drop date and time, starts the countdown (e.g. `'2026-10-17T18:00:00+01:00'`)
- `CONFIG.CODE`: the drop code the list receives
- `PRODUCTS[].price`: naira prices (`null` shows "Price drops soon")
- `CELEBS`: name, what they wore, IG post link, photo

## Vercel
- Root directory: `yowa/site`
- Env var `OPENROUTER_API_KEY` for the Ask YOWA chat (`api/chat.js`)
- Env vars `SUPABASE_URL` and `SUPABASE_ANON_KEY` for sign-ups (`api/join.js`). They write to the same Supabase `waitlist` table as the waitlist site, and the key stays on the server. Formspree still gets a copy either way.

## Domain: yowabybd.com (registered at Hostinger)
The domain uses Vercel's nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), so Vercel runs its DNS and the HTTPS certificate. `www.yowabybd.com` redirects to `yowabybd.com`. Email records (MX), if the domain ever needs email, are added in Vercel → Domains → yowabybd.com.

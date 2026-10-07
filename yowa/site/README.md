# YOWA main site

Static site (HTML + two serverless functions), deploys on Vercel like the waitlist. Built for phones first: everything below works by touch, and the desktop layout is the same site with more room.

## How it's laid out
- One short scrolling page: about six phone screens from top to bottom.
- **Top:** YOWA over the photos, with Be You Be Different 💜⚔️🐉 under it.
- **Then, in the menu's order:** Shop, Gallery (six photos) and the Library (nine square photos at a time, Show more for the rest), Message, Get the code and a one-line footer.
- **Shop:** the product count and a catalog switch (two across or one across, remembered on the phone), then the pieces: photo, NAME // COLOUR and the price (`₦45,000.00 NGN`) in Saira. Pieces with their background removed (`cut: true`) sit on a light studio backdrop.
- **Product view:** the photos play like the opening slideshow (bars fill, it moves on by itself; tap right or left, swipe, or hold to pause). Round size pickers, a quantity picker and Add to cart.
- **Cart:** Close, swipe right or back closes it. The drop code is asked for at checkout, with a link to the list for anyone who doesn't have it yet.
- **Menu:** the glowing purple dragon top right. It breathes fire as the menu opens, flies off for the X, and comes back with a puff when the menu closes (now and then it lets out a little spark on its own). Home, Shop, Gallery, Message, Get the code and Ask YOWA. Shop opens its categories in place (New, All, Raglan shirts, Tees, Caps, Skull caps, Joggers); picking one slides in the side shop with those pieces, each with its size, quantity and Add to cart, plus the same one-or-two switch.
- **Light and dark:** the half-moon button next to the cart. Dark is the night purple; light is lavender paper with the same purple. Remembered on the phone.

## Photos and their codes
Every photo has a fixed code, written next to it in `LIBRARY` at the top of the script in `index.html` (`no: 'YW·010'`). Codes never shift when photos are added or moved. A new photo goes at the end of the list with the next free code (the last one is YW·054).

| Where | Photo |
|---|---|
| Hero slideshow, in order | YW·054 the skateboard kickflip (`img/library/yowa-skate.jpg`), YW·010 the crew, YW·033 the black raglan, YW·042 red and black |
| Message background | YW·010, with its motion clip `img/motion/crew.mp4` |
| The list background | YW·033 |
| `img/look-*.jpg`, `img/detail-*.jpg`, `img/raglan-*.jpg` | The "In real life" gallery and the product photos |
| `img/library/` | Every photo, 1600px. `img/library/t/` holds the small copies the grids and cards load |
| `img/share.jpg` | The card WhatsApp, X and iMessage show when someone shares the link |

The hero slides are set in `CONFIG.HERO_SLIDES`: `no` (the code), `src`, `cap` (the short caption), `pos` (which part of the photo stays in frame on a phone). Optional: `hold` (ms on screen), `video` (a looping clip over the photo).

## Library
- `LIBRARY` lists every photo: code, file, size, caption, `shelves` (what's in the photo: Raglan shirts, Plain tees, Skull caps, Caps, Joggers) and the product it shows (adds "Shop this piece" in the viewer).
- The shelves are the filters above the photos. A photo with a raglan and joggers in it sits on both.
- Any photo can be shared with its own link, like `yowabybd.com/#yw-010`. It opens straight in the viewer, and the Share button in the viewer sends that link.
- `CONFIG.LIBRARY_FEED` reads `https://yowa-library.vercel.app/api/photos`. A photo filed there in any folder except `brand` and `inbox` joins the Library on its own, numbered after the highest code. Its tags and folder name pick its shelves (raglan, tee, skull cap, cap, jogger). Leaving a photo in `inbox` keeps it off the site. Set the feed to `''` to turn this off.

## How it moves
- **Hero:** works like a story. The bars fill while a photo is up. Tap the right side for the next, the left for the last, swipe, or hold to pause and clear YOWA off the photo. Tap the code in the corner to open that photo in the Library. On Android the photo leans as the phone tilts.
- **Glitch:** only YOWA glitches, never the photos of people or the mantra. The logo tears, splits purple and cyan, blinks out and snaps back: on every new photo, now and then on its own, when tapped, and when you come back home.
- **Dragons:** a purple dragon before and after every section, like barriers between them: head with horns, a gold eye, teeth and whiskers, spines down its back and plates on its belly. Every other one faces the other way. The first sits on the opening screen, right under Be You Be Different 💜⚔️🐉. They slither, and thrash when you scroll fast. Sections fade at their edges, so none of them ends on a straight line.
- **Signature:** top left. It writes itself on load, and again when tapped (which also takes you back to the top).
- Everything still and calm when the phone is set to reduce motion. Motion clips are skipped on data saver.

## Phone details
- The back button closes the menu, the side shop, a product, the cart, the chat or the viewer instead of leaving the site.
- Products open as a bottom sheet. Drag its handle down to put it away.
- The header slides away while you scroll down and comes back when you scroll up. The thin line on top shows how far down the page you are.
- Vibration on unlock, a wrong code, add to cart and joining the list (Android).
- Add to Home Screen gives a YOWA app icon (`manifest.webmanifest`, icons in `img/brand/`).
- "Be You Be Different" always carries 💜⚔️🐉, on the page and in Ask YOWA's replies.

## Edit at the top of the `<script>` in index.html
- `CONFIG.DROP_AT`: drop date and time, starts the countdown on The drop page (e.g. `'2026-10-17T18:00:00+01:00'`)
- `CONFIG.CODE`: the drop code the list receives (asked for in the product view when someone buys)
- `PRODUCTS[]`: `price` in naira (`null` shows "Price drops soon"), `cat` (raglan, tee, cap, skull, jogger), `isNew` (shows under New), `cut` (background removed), `images` (the slideshow, in order). Cut-out photos live in `img/products/`.
- `CATS`: the categories in the menu's Shop list and the side shop

## Vercel
- Root directory: `yowa/site`
- Env var `OPENROUTER_API_KEY` for the Ask YOWA chat (`api/chat.js`)
- Env vars `SUPABASE_URL` and `SUPABASE_ANON_KEY` for sign-ups (`api/join.js`). They write to the same Supabase `waitlist` table as the waitlist site, and the key stays on the server. Formspree still gets a copy either way.

## Domain: yowabybd.com (registered at Hostinger)
The domain uses Vercel's nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), so Vercel runs its DNS and the HTTPS certificate. `www.yowabybd.com` redirects to `yowabybd.com`. Email records (MX), if the domain ever needs email, are added in Vercel → Domains → yowabybd.com.

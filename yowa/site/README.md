# YOWA main site

Static site (HTML + two serverless functions), deploys on Vercel like the waitlist. Built for phones first: everything below works by touch, and the desktop layout is the same site with more room.

## How it's laid out
- One short scrolling page: about six phone screens from top to bottom.
- **Top:** the photos, with BE YOU / BE DIFFERENT and the heart, swords and dragon low over them in the Black Panther font (licensed by YOWA, self-hosted in `fonts/`) (no big YOWA there; YOWA spins in the header).
- **Then, in the menu's order:** Shop, Gallery (six photos) and the Library (nine square photos at a time, Show more for the rest), Message, Get the code and a one-line footer.
- **Shop:** eight pieces, every one cut out and glowing on the dark: the Liberty Raglan (black, red, blue or grey sleeves, with beads or without), the Ringer Tee, the YOWA Long Sleeve, the Be Different Tee (the purple YOWA front, Be You Be Different on the back), Joggers (black or grey) and Jorts (black, purple or grey), each with beads or without, the Skull Cap (camo or black, with no beads, black beads or white beads) and the 042 Cap. Each card has an eye (see it) and a bag (add it) by its side and its colours under the name; tapping a colour swaps the photo. The bag adds a piece with nothing to choose (the 042 cap) straight away; anything else opens on its choices. Sizes are M, L, XL and XXL. The piece count and the one-or-two-across switch sit on top. The photos live in `img/products/` and are listed in `PRODUCTS` (`opts` are the choices, `looks` the photos for each choice). Every piece shows its front first and its back last. In the product view the description comes last, after the size, quantity and Add to cart.
- **Product view:** the photos play like the opening slideshow (bars fill, it moves on by itself; tap right or left, swipe, or hold to pause). Round size pickers, a quantity picker and Add to cart. The choices sit above the size: colours as round swatches, beads as pills; the photos follow what you pick, and the cart keeps it (e.g. "Skull Cap · Black · White beads").
- **Cart:** The cart icon top right shows how many pieces are in it. The X, a swipe right or back closes it. The drop code is asked for at checkout, with a link to the list for anyone who doesn't have it yet.
- **Header:** like gocrazy: the crystal dragon (the menu) and a back arrow on the left, YOWA in the middle turning round in 3D (a front, a mirrored back and purple layers for its thickness, one turn every 9 seconds), the light/dark switch and the cart icon on the right, the same on phones and computers. The back arrow glides back to where you were before your last jump (a menu link, YOWA, any # link), or up to the top; it dims when there is nowhere to go back to and hides while the menu is open. The bar is solid when it sticks (no blur, so scrolling stays smooth).
- **Menu:** tap the crystal dragon and it shines, the menu grows out of it as a circle and an X takes its place. Behind the menu is the slimy YOWA swirl. Centred: the signature, Home, Shop (with a small crystal dragon beating its wings), Gallery, Message, Get the code; down at the bottom the mantra (in the Black Panther font) and Instagram. Ask YOWA lives on its own button on the page, not in the menu. Shop opens New, All, Tops, Caps and Bottoms with a round thumbnail and how many pieces each has; picking one slides in the side shop with the same cards.
- **Light and dark:** the sun (in dark) turns into the moon (in light) and the page flips to the other mode in a circle growing from the button, where the browser supports it. Remembered on the phone.
- **Ask YOWA:** the fire dragon is its face, on the button and in the chat, and the chat sits on the fire dragon art.

## Photos and their codes
Every photo has a fixed code, written next to it in `LIBRARY` at the top of the script in `index.html` (`no: 'YW·010'`). Codes never shift when photos are added or moved. A new photo goes at the end of the list with the next free code (the last one is YW·054).

| Where | Photo |
|---|---|
| Hero slideshow, in order | `img/hero/hero-1.jpg` to `hero-5.jpg`: the crew in the 042 caps, Be You Be Different across the back at night, the red raglan, black long sleeves at the shutter, raglans and the skateboard in the car park. Just the photos, no codes on top |
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
- **Hero:** works like a story. The bars fill while a photo is up. Tap the right side for the next, the left for the last, swipe, or hold to pause and clear the words off the photo. Tap the code in the corner to open that photo in the Library. On Android the photo leans as the phone tilts.
- **Dragons:** for now there are no dragons flying between the sections; the sections follow each other over the swirl. To bring one back, drop a long dragon (see-through PNG or on black) in `img/dragon/` and put a lane back between sections.
- **Signature:** at the top of the menu, and in the Message section under the letter.
- **The heart, the swords and the dragon:** YOWA's own icons (`img/brand/bybd-heart.png`, `bybd-swords.png`, `bybd-dragon.png`) stand in for 💜⚔️🐉 everywhere on the page: the opening line, the letter, the footer, product notes, the sign-up note, Ask YOWA's replies and the burst when you tap them. They are masks, so they take the colour of the words around them. Text that goes off the page (sharing, the page title) keeps the emojis or drops them.
- Everything still and calm when the phone is set to reduce motion. Motion clips are skipped on data saver.

## Phone details
- The back button closes the menu, the side shop, a product, the cart, the chat or the viewer instead of leaving the site.
- Products open as a bottom sheet. Drag its handle down to put it away.
- The header slides away while you scroll down and comes back when you scroll up. The thin line on top shows how far down the page you are.
- Vibration on unlock, a wrong code, add to cart and joining the list (Android).
- Add to Home Screen gives a YOWA app icon (`manifest.webmanifest`, icons in `img/brand/`).
- "Be You Be Different" always carries the heart, swords and dragon, on the page and in Ask YOWA's replies (it writes 💜⚔️🐉 and the page shows the icons).

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

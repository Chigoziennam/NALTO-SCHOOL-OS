# YOWA — Main Site Blueprint

**Tech pack:** YW-WEB-01 · **Rev:** A · **Date:** 30 Sep 2026 · **Prepared by:** Nalto
**Status:** Planning. Visual direction locks once the waitlist look is reviewed.

This file is the source of truth for the YOWA main site. Every build session starts here.
The visual version of this plan (live motion swatches, colorways, diagrams) is `yowa/blueprint.html`.

---

## 0. What we found before planning

| Source | Finding |
|---|---|
| Claude Code sessions (20), GitHub repos (23), artifacts (3) | Nothing named YOWA. The earlier waitlist work was done outside these. |
| Waitlist | Live at https://yowa-waitlist.vercel.app/ — not in GitHub. This cloud environment's network policy blocks it, so the look is **pending** (screenshots or source needed, or allow the domain). |
| House stack (NALTO SchoolOS) | React + Vite + TypeScript + Tailwind + Framer Motion, Supabase, Paystack InlineJS, n8n, Resend, Vercel. |
| Existing AI pattern ("Nalto AI") | Chat widget → n8n webhook → OpenRouter `openai/gpt-4o-mini` (temperature 0.4, max_tokens 300), keyword fallback. No streaming, no tools. |
| Existing Paystack pattern | `newTransaction` in the browser with the amount set client-side; webhook pinged from the browser. Fine for a demo, not for a shop. |
| Higgsfield | Connected. Free plan, **10 credits**, 0 websites. Models available include Kling 3.0, Cinema Studio Video, Seedance 2.5, Marketing Studio, 3D generation. |
| Network policy | `openrouter.ai`, `yowa-waitlist.vercel.app`, `awwwards.com` are blocked from this cloud environment. Add them under Environment → Network access (Custom) to test from cloud sessions. |

---

## 1. Brief

**North star.** Every visit should feel like arriving at a YOWA drop: something is happening right now, and you can be part of it.

**The site's job.** Turn Instagram attention into owned customers: waitlist → Circle member → buyer → repeat buyer.

**Audience (assumed, confirm).**
- Lagos and Abuja, 18–35, mobile-first, arriving from Instagram, TikTok and WhatsApp links.
- Diaspora buyers (UK/US) who follow the people who wear YOWA.
- Stylists, press and celebrity teams checking credibility.

**Principles.**
1. **Event, not catalogue.** The homepage is a stage for the current drop, with live stock and a real countdown.
2. **Loud at the door, quiet at the till.** Big motion on the homepage, drop pages and Worn By. Calm, fast, product-first screens for shop, product pages and checkout.
3. **Proof sells.** Celebrity and community wear sits inside shopping: "Worn by" on product pages and shop-the-look on every celeb photo.
4. **Built for Lagos data.** A mid-range Android on 4G is the reference device. Video plays only when the connection can afford it. Everything has a light version.
5. **Answers in seconds, a human in one tap.** The AI concierge handles sizing, stock and order tracking around the clock and hands over to WhatsApp when it should.

**Assumptions (confirm or correct).**
- YOWA sells apparel, streetwear-leaning, released in drops, priced in naira, based in Nigeria.
- The waitlist has signups we will import.
- Instagram is the main channel; celebs who wore YOWA posted it there.
- New Supabase project for YOWA; Paystack business account in NGN.

---

## 2. Colorways (visual direction)

Each direction is built from things in YOWA's world. Pick one for **the door** (homepage, drops, Worn By). **The till** (shop, product, checkout) uses a calm neutral version of the same palette in every case.

| Code | Name | Mood | Palette | Motion character | Fits if… |
|---|---|---|---|---|---|
| CW-00 | Waitlist | Match the live waitlist | Pending | Pending | Continuity with the waitlist matters most (default once reviewed). |
| CW-01 | Chalk | Quiet luxury: tailor's chalk, pattern notches, pinned swatches | Charcoal wool `#1E1D1B`, chalk `#EFEDE8`, chalk blue `#9DB4E0`, brass pin `#B8913A` | Slow and precise; chalk lines draw dividers; soft mask reveals | YOWA prices upmarket. |
| CW-02 | Danfo | Lagos street energy: danfo-bus yellow, sign-writer lettering, stickers, bus-park boards | Danfo yellow `#F6C200`, tar black `#111111`, sticker white `#FFFFFF`, stop red `#E0261B` | Fast and punchy; split-flap clocks; sticker slaps; scroll-speed tickers | YOWA is hype-led, drop-driven, youth-first. |
| CW-03 | Adire | Heritage made modern: indigo resist-dye, cloth folds | Indigo `#1C2A5A`, deep indigo `#0F1736`, resist white `#E9EDF5`, kola `#B4532A` | Reveals spread like dye through cloth | YOWA's story is Nigerian craft and textile. |

**Lean before seeing the waitlist:** CW-02 Danfo for a drop-led streetwear label. It is unmistakably Lagos and nothing in the global feed looks like it. The waitlist look (CW-00) overrides this if it is already strong.

Type: previews use one variable family (Anybody) to show width-based motion. The production site gets a licensed display face chosen with the brand, plus a clean text face.

---

## 3. Motion language

**Tools.** GSAP (ScrollTrigger, SplitText, Flip, Observer; 100% free incl. commercial since 30 Apr 2025), Lenis smooth scroll, Motion (motion/react) for React UI state, OGL (lazy-loaded) for one WebGL moment, `<model-viewer>` for 3D, CSS scroll-driven animations for simple progress effects.

**Tokens.**
- Durations: micro 160 ms · UI 320 ms · reveal 700 ms · film 1200 ms.
- Easing: `settle` = `cubic-bezier(0.16, 1, 0.3, 1)` (fabric landing), `pull` = `cubic-bezier(0.65, 0, 0.35, 1)` (drawn across). UI springs: stiffness 400, damping 30.
- Stagger: letters 40 ms, words 80 ms, cards 120 ms.

**Rules.** Animate transform and opacity only. One signature moment per screen. Never block input (no scroll-jacking beyond pinned sections). Pause offscreen loops. Every animation has a `prefers-reduced-motion` version (cross-fade or static).

**Signature moments (swatches S-01…S-10 in blueprint.html).**

| Code | Moment | Where | Build |
|---|---|---|---|
| S-01 | Stitch loader: wordmark stitches in, counter syncs to real loading, ≤1.2 s, first visit only | First load | SVG stroke dash + counter |
| S-02 | Fabric-stretch wordmark: letters rise, width stretches like jersey and settles; follows the cursor | Hero, footer | Variable-font `wdth` axis + GSAP |
| S-03 | Scroll-speed ticker: speeds up and skews with scroll velocity | Under hero, drop banners | GSAP Observer velocity |
| S-04 | Departure-board countdown: split-flap digits, server-time synced | Drop page, hero | CSS 3D flips + server time |
| S-05 | Worn By wall: drag and throw with inertia; tap opens the look | /worn-by, homepage strip | Pointer events + inertia + Flip |
| S-06 | Living product card: still first, film on hover, magnetic add-to-bag, flies into the bag | Shop grid, drop rail | Higgsfield 3 s loop (`preload="none"`) |
| S-07 | Password gate: wrong code shakes like cloth; right code pulls the curtain | Early-access window | Form + keyframes |
| S-08 | Manifesto light-up: words brighten as you read | Brand story | ScrollTrigger scrub / scroll-driven CSS |
| S-09 | Concierge: answers with live data, tool calls visible as chips | Everywhere | See §7 |
| S-10 | Pay moment: Paystack popup, then the hang tag stitches closed | Checkout success | See §8 |

---

## 4. Sitemap and page anatomy

```
/                      Home (the door)
/drop/[slug]           Drop: teaser → early access → public → sold out → archive
/shop, /shop/[cat]     Shop (the till)
/p/[slug]              Product
/worn-by               Worn By wall
/worn-by/[person]      One look: hotspots, shop the look, IG post
/lookbook/[season]     Lookbook
/journal/[post]        Stories, BTS, SEO
/circle                YOWA Circle: early access, referrals, rewards (waitlist lives on here)
/help                  Concierge full-page + FAQ; /size-guide /shipping /returns
/track → /order/[ref]  Order lookup (ref + email or phone)
/account               Orders, addresses, wishlist
/checkout → /checkout/success
/admin                 Orders, stock, drops, Worn By, conversations, Circle, discounts
/privacy /terms        NDPA 2023-compliant privacy, terms, cookies
```

**Homepage storyboard (in scroll order).**
1. Stitch loader (first visit only).
2. Hero: film loop (poster first), fabric-stretch wordmark, countdown or "Live now", "Enter the drop".
3. Scroll-speed ticker.
4. Drop rail: pinned horizontal scroll of living product cards with live stock per size.
5. Worn By strip: drag wall, shop the look.
6. Lookbook teaser: curtain reveals.
7. Manifesto light-up.
8. Community: curated #WearYOWA posts.
9. Circle sign-up: email + WhatsApp.
10. Footer: giant wordmark that reacts to the cursor, WhatsApp, payment badges.

**Product page.** Living still → gallery → 3D view → size selector with "Find my size" (opens concierge with this product) → stock per size → delivery estimate by state → "Worn by" badges → Add to bag → complete the look. Every product gets an auto-generated share card (OG image) so WhatsApp and Instagram DMs show a rich preview.

---

## 5. Worn By (celebrity area)

- **Tile:** portrait (cleared rights) · name · category (Music / Film / Sport / Creator) · date worn · pieces worn (linked) · Instagram handle linking to the post.
- **Person page:** hero portrait, hotspots on the photo linked to exact variants ("Shop the look"), link to the IG post, related looks. Those products automatically show "Worn by" badges.
- **Rights model (one per entry):**
  - *Owned* (our shoot) → full image.
  - *Permission* (they or their team agreed; logged) → full image with credit.
  - *Embed only* (no rights) → text tile; the official Instagram embed loads only when someone taps "View post".
- **Why not auto-embed every IG post:** each embed pulls Instagram's script and media (slow on mobile data) and breaks when a post is deleted. Manual embeds (copied from Instagram's ⋯ → Embed) need no API key; the oEmbed API needs a Meta app token.
- **Admin flow (~2 min per entry):** paste IG post URL → upload photo → pick products → click to place hotspots → set rights status → publish.
- **Needed:** list of names, IG post links, dates, pieces worn, and photo rights status.

---

## 6. Drops engine

States: **Teaser → Early access → Public → Sold out → Archive.**
Triggers: `teaser_at`, `early_access_at` (Circle link/code or password), `public_at`, stock = 0 or `ends_at`, manual archive.

- Countdown runs on server time, so a phone with the wrong clock still shows the truth.
- Circle (ex-waitlist) members get early access by personal link or code. Optional password gate for hype drops (Corteiz-style).
- Live stock per size via Supabase Realtime; "N people in the drop" via Presence.
- Stock holds: 15 minutes from checkout start, released automatically by pg_cron.
- Per-customer limits; Cloudflare Turnstile on checkout during drops.
- Sold out is a designed screen: restock alert sign-up + next drop teaser.
- Waiting room for very large drops (phase 3).

---

## 7. AI Concierge (OpenRouter)

**Flow.** Chat widget → Supabase Edge Function `concierge` (rate limit per IP and session) →
1. Embed the question with Supabase's built-in `gte-small` (384-d, no external key) → `match_kb` over `kb_chunks` (pgvector).
2. Call OpenRouter chat completions with `stream: true`, tools, and a `models` fallback list (headers `HTTP-Referer`, `X-Title`).
3. Execute tool calls server-side against Supabase; send results back to the model.
4. Stream the answer to the widget. Log everything to `support_conversations` / `support_messages`.

**Tools.**
- `search_products(query, size?, max_price?)`
- `get_product(slug)`, `check_stock(variant_id)`
- `recommend_size(product, height_cm, weight_kg, fit)`
- `shipping_quote(state)`
- `track_order(ref, email_or_phone)` — needs both, so nobody can look up someone else's order
- `policy_lookup(topic)`
- `handoff_to_human(reason)` → WhatsApp deep link with the conversation ID + ticket

**Guardrails.** Never state stock, prices or dates without a tool call. No refund promises beyond policy. Escalate on payment disputes, damaged items, angry tone, anything legal. Reply in the customer's language (Pidgin included). Short replies (~120 words max). Every conversation logged and reviewable in admin; thumbs up/down in the widget.

**Surfaces.** Quiet floating launcher (no auto-popups), "Ask about fit" on product pages (pre-loaded with the product), "Question about this order?" on order pages, full-page /help. Later: the same brain on WhatsApp.

**Models (OpenRouter list prices per 1M tokens, input / output, Sep 2026).**

| Role | Model | Price |
|---|---|---|
| Primary | `anthropic/claude-haiku-4.5` | $1 / $5 |
| Fallback | `google/gemini-2.5-flash` | $0.30 / $2.50 |
| Budget option | `openai/gpt-5-mini` | $0.25 / $2 (can spend extra reasoning tokens; measure latency first) |
| Current Nalto AI | `openai/gpt-4o-mini` via n8n | — |

**Cost per conversation** (≈5 turns ≈ 12,500 input + 1,250 output tokens): Haiku 4.5 ≈ $0.019 · Gemini 2.5 Flash ≈ $0.007 · GPT-5 mini ≈ $0.006. At 1,000 conversations a month, Haiku costs about $19. Prompt caching of the stable system prompt and policies lowers input cost on Anthropic models.

**Secrets.** The OpenRouter key lives only in Supabase function secrets. Never in the browser, never in `NEXT_PUBLIC_*` variables, never pasted in chat.

---

## 8. Checkout and Paystack

**Sequence.**
1. Shopper taps Pay. The site server re-prices the bag from Supabase (browser prices are never trusted).
2. Supabase creates the order as `pending` and holds stock for 15 minutes (`reserve_stock`).
3. The site server calls Paystack **Initialize** with the secret key: amount in kobo, `reference` = order ref, `metadata.order_id`.
4. The browser opens the Paystack popup with the returned `access_code` (`new PaystackPop().resumeTransaction(access_code)`). Card, bank transfer, USSD, bank.
5. On `onSuccess`, the site server calls **Verify** and checks amount + currency against the order.
6. Paystack sends `charge.success` to the Supabase Edge Function `paystack-webhook`, which checks `x-paystack-signature` (HMAC-SHA512 of the raw body with the secret key) and runs `finalize_paid_order` (idempotent).
7. Order paid → stock committed → receipt email (Resend) + WhatsApp update → success page.

If the tab closes after paying, step 6 still completes the order. Unpaid holds expire after 15 minutes.

**Also.** Discount codes and Circle credit applied server-side. Abandoned-checkout reminder after 1 hour (phase 2). Refunds from admin via Paystack's refund API; `refund.processed` updates the order. Test keys first; live after business verification.

**Currencies.** NGN default. Nigerian Paystack accounts can add USD for diaspora customers once enabled; USD card fees are higher, so confirm current rates in the Paystack dashboard.

---

## 9. Supabase data model

Money is stored in minor units (kobo / cents) as `bigint`, as in NALTO.

**Catalogue.**
- `products` (id, slug, name, description, category, price_ngn, price_usd, status[draft|scheduled|live|archived], drop_id, fabric, gsm, fit, care, seo jsonb)
- `product_variants` (id, product_id, sku, size, colour, stock_on_hand, stock_reserved, price_override)
- `product_media` (id, product_id, kind[image|video|model3d], url, poster_url, alt, sort, source[shoot|higgsfield], higgsfield_job_id)
- `collections`, `collection_products`
- `drops` (id, slug, name, teaser_at, early_access_at, public_at, ends_at, gate_mode[none|circle|password], password_hash, per_customer_limit, hero_media_id, status)

**Commerce.**
- `carts`, `cart_items` (server cart; enables abandoned-checkout recovery)
- `orders` (id, ref e.g. `YW-2610-8K3F`, profile_id?, email, phone, status[pending|paid|fulfilling|shipped|delivered|cancelled|refunded], currency, subtotal, shipping, discount, total, shipping_address jsonb, zone_id, paystack_reference unique, paid_at)
- `order_items` (order_id, variant_id, qty, unit_price, name/size/colour snapshot)
- `stock_holds` (variant_id, order_id, qty, expires_at)
- `payments` (order_id, provider, reference unique, amount, currency, channel, status, raw jsonb, verified_at)
- `refunds`, `shipments` (carrier, tracking_no, status, events jsonb), `shipping_zones` (name, states[], price, eta_days, free_over)
- `discount_codes` (code, type, value, max_uses, per_customer, starts_at, ends_at, circle_only)
- `restock_alerts` (variant_id, email, phone, notified_at)

**People.** `profiles` (role, circle_tier, referral_code, referred_by, marketing_opt_in), `waitlist` (imported: email, phone, ig_handle, position, referral_code, referred_count, source), `wishlists`.

**Proof.** `worn_by` (slug, name, category, ig_handle, ig_post_url, portrait_url, rights_status[owned|permission|embed_only], quote, worn_on, featured_rank, published), `worn_by_items` (worn_by_id, product_id, variant_id?, hotspot_x, hotspot_y), `ugc_posts`.

**Support.** `kb_articles`, `kb_chunks` (embedding `vector(384)`), `support_conversations` (channel, profile_id?, order_ref?, status[bot|needs_human|closed], rating), `support_messages` (role, content, tool_calls jsonb, tokens_in, tokens_out, model).

**Functions.** `reserve_stock(order_id)` (row locks), `release_expired_holds()` (pg_cron every 5 min), `finalize_paid_order(reference, amount, currency)` (idempotent, checks amount), `match_kb(embedding, k)`, `lookup_order(ref, contact)`.

**Security.** RLS on every table. Public reads: published catalogue, drops, Worn By. Customers read their own orders. Admin role writes. Secret keys only in server code and Edge Functions.

**Realtime.** Stock per variant during drops; Presence for "in the drop now". **Storage.** `product-media`, `worn-by` (public, CDN), private exports.

---

## 10. Higgsfield production plan

| # | Asset | Where | Model / preset | Spec |
|---|---|---|---|---|
| 1 | Hero film loop | Homepage hero | Kling 3.0 image-to-video (same start/end frame for a clean loop) or Cinema Studio Video (camera moves, speed ramps) | 6–8 s, 16:9 + 9:16, silent |
| 2 | Drop teaser reels | IG/TikTok, drop page | Presets: Frozen in motion, Clones, Studio slide, Halftone Street Collage | 9:16, 10–15 s |
| 3 | Living product stills | Shop grid, product pages | Image-to-video from packshots | 3–4 s loops, 4:5 |
| 4 | Lookbook openers | Lookbook | Fashion Editorial Reveal, Scrapbook collage | 16:9 + 9:16 |
| 5 | Worn By intro | /worn-by header | Music Zine Collage | ~6 s |
| 6 | Countdown backdrops | Drop pages | Slow ambient | 8 s loop |
| 7 | 3D product models | Product pages | `generate_3d` from a clean packshot → GLB | Test quality first |

**Pipeline.** Real product photo → Higgsfield (image-to-video keeps the garment accurate) → QA against the real garment (logos and prints) → trim/loop → encode (H.264 MP4 + WebM; 720p mobile ≤ 1.2 MB, 1080p desktop ≤ 3 MB; AVIF poster) → Supabase Storage → CDN.

**Rules.** Never generate a real person's likeness; celebrities appear only in real, cleared photos. Label AI campaign imagery where required.

**Credits.** Free plan, 10 credits: enough for a test, not for this shot list. Upgrade before production and check per-model credit costs before planning the batch. First step: 3–5 clean product photos → one hero test.

---

## 11. Stack (bill of materials)

| Component | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) on Vercel | Server rendering for Google and rich WhatsApp/IG link previews; server code for payments |
| Styling | Tailwind CSS + CSS-variable tokens | Same as NALTO |
| Motion | GSAP + Lenis + Motion; OGL (lazy); `<model-viewer>` | See §3 |
| Data | Supabase: Postgres, Auth (email/phone OTP), Storage, Realtime, Edge Functions, pg_cron, pgvector | One platform for data, auth, AI retrieval, jobs |
| Payments | Paystack: server Initialize/Verify, InlineJS popup, webhooks | Nigerian cards, transfer, USSD |
| AI | OpenRouter with model fallback | Swap models without code changes |
| Motion assets | Higgsfield (production pipeline, not runtime) | Brand films, loops, 3D |
| Email | Resend + React Email | Receipts, shipping, drops |
| Messaging | WhatsApp links day one; WhatsApp Business API later | Where Nigerian customers are |
| Automations | n8n (already in use) | Order notifications, restock alerts, weekly reports |
| Anti-bot | Cloudflare Turnstile | Drop fairness |
| Analytics | PostHog or Vercel Analytics; Meta Pixel + Conversions API; TikTok Pixel | Ads attribution from IG/TikTok |
| Errors | Sentry | |

**Why not the NALTO Vite setup:** a single-page app can't render product pages for search or show rich link previews in WhatsApp and Instagram DMs, and it set payment amounts in the browser. Same building blocks, better frame.

---

## 12. Points of measure (performance and accessibility budgets)

| POM | Measure | Target |
|---|---|---|
| A | Largest Contentful Paint, 4G mid-range Android | ≤ 2.5 s |
| B | Interaction to Next Paint | ≤ 200 ms |
| C | Cumulative Layout Shift | ≤ 0.1 |
| D | JavaScript on first load (gzip), our budget | ≤ 180 KB |
| E | Hero video on mobile; loads only on fast connections, poster first | ≤ 1.2 MB |
| F | Accessibility | WCAG 2.2 AA, full keyboard, reduced-motion versions |

---

## 13. Roadmap

- **Phase 0 · Foundations (week 1):** lock colorway against the waitlist; brand tokens; content inventory (products, photos, celeb list with rights); Supabase project + schema; Next.js scaffold; Paystack test keys; first Higgsfield hero test.
- **Phase 1 · Launch (weeks 2–4):** home, drop page (countdown + Circle early access), shop, product page, bag, Paystack checkout (NGN), order emails, Worn By wall + person pages, concierge v1 (FAQ, sizing, order tracking), admin (products, stock, orders, Worn By), analytics, legal pages.
- **Phase 2 · Growth (weeks 5–8):** USD for diaspora, restock alerts, abandoned-checkout reminders, Circle referrals and tiers, 3D viewer, lookbook + journal, WhatsApp order updates, delivery partner integration, reviews and UGC.
- **Phase 3 · Signature (after launch):** concierge on WhatsApp, virtual try-on, NFC authenticity tags (digital passport per garment), waiting room for big drops, Instagram shopping sync.

---

## 14. Needed from you

1. The waitlist look: screenshots (desktop + phone), the source files, or allow `yowa-waitlist.vercel.app` in this environment's network access.
2. Logo files, brand colours, fonts (if set).
3. First drop: product names, prices, sizes, stock, 3–5 clean photos per piece.
4. Worn By list: name, IG post link, date, pieces, photo rights.
5. Launch / first drop date.
6. Delivery zones, prices, partner; returns policy.
7. Domain, Instagram handle, WhatsApp business number.
8. Paystack: business verified? USD wanted?
9. A new Supabase project for YOWA (project URL + anon key; service keys never in chat).
10. OpenRouter key goes straight into Supabase function secrets.
11. Higgsfield plan upgrade for production credits.
12. Concierge name and voice; may it reply in Pidgin?

---

## 15. References

- Lacoste — Polo Factory (Merci Michel), Awwwards SOTD 21 Jul 2026: https://www.awwwards.com/sites/lacoste-polo-factory
- Brunello Cucinelli — AI E-com (makemepulse), Awwwards SOTD 9 Jul 2026: https://www.awwwards.com/sites/brunello-cucinelli-ai-e-com
- Awwwards fashion winners 2026 (MIU MIU, Serotoninn, Lacoste Ace Breaker, Aralesk): https://www.awwwards.com/websites/fashion/
- Jacquemus, Awwwards SOTD: https://www.awwwards.com/sites/jacquemus
- Corteiz password drops: https://trenchtrenchtrench.com/features/corteiz-who-rules-the-world · https://growthcurve.co/corteiz-growth-playbook-how-crtz-turned-drops-stunts-and-owned-distribution-into-a-repeatable-attention-system
- Daily Paper: https://dailypaperclothing.com/
- WAFFLESNCREAM Lagos: https://www.wafflesncream.com/pages/lagos-store
- Severe Nature, Lagos to London: https://www.appearhere.co.uk/inspire/blog/from-lagos-to-london
- Nigeria's streetwear renaissance (Highsnobiety): https://www.highsnobiety.com/p/nigeria-streetwear-culture/
- Codrops — Infinite Canvas (Jan 2026): https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/
- Codrops — free GSAP plugin demos (May 2025): https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/
- GSAP 3.13 (all plugins free): https://gsap.com/blog/3-13/
- Paystack: https://paystack.com/docs/payments/accept-payments/ · https://paystack.com/docs/developer-tools/inlinejs/ · https://paystack.com/docs/payments/webhooks/
- Supabase AI inference (gte-small): https://supabase.com/blog/ai-inference-now-available-in-supabase-edge-functions · https://supabase.com/docs/guides/ai/automatic-embeddings
- Instagram embeds: https://developers.facebook.com/docs/instagram-platform/oembed
- OpenRouter models: https://openrouter.ai/anthropic/claude-haiku-4.5 · https://openrouter.ai/google/gemini-2.5-flash · https://openrouter.ai/openai/gpt-5-mini

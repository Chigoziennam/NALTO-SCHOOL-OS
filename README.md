# NALTO SchoolOS — Archangels' Schools Fee Portal

Premium school fee management portal built by **Nalto** for Archangels' Schools
(Satellite Town, Lagos) — demo MVP. React + Vite + TypeScript + Tailwind +
Framer Motion, with a Supabase data layer and n8n automation workflows.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (tsc + vite)
```

The demo runs **with zero configuration** — every screen falls back to built-in
seed data shaped exactly like the Supabase views, so it demos flawlessly
offline. Add real keys to go live:

```bash
cp .env.example .env
# fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
# VITE_PAYSTACK_PUBLIC_KEY, VITE_N8N_* webhook URLs
```

## The heaven hero

The landing hero renders `/public/assets/heaven.jpg` with animated god-rays,
a breathing golden halo and drifting light motes (`src/components/HolyLight.tsx`).
**Drop your heaven image at `public/assets/heaven.jpg`** — until then a
procedural heavenly-sky SVG (`heaven.svg`) is used as fallback. An optional
hero video can be placed at `public/assets/archangels-hero.mp4`; the heaven
image doubles as its poster and is always used on mobile (data saver).

## Pages

| Route | Screen |
|---|---|
| `/` | Landing — heavenly hero, count-up stats bar, How It Works, campus strip, footer |
| `/parent` | Parent dashboard — children cards, outstanding card with Paystack Pay Now, payment history |
| `/parent/invoice/:invoiceId` | Branded invoice with crest watermark, line items, Pay Balance, PDF download |
| `/bursar` | Bursar dashboard — KPIs, donut chart, class breakdown, live payments feed (30s refresh), Add Student & Record Payment modals |
| `/bursar/report` | Print-optimised A4 fee collection report (print + PDF download) |

No auth wall — this is a demo. The "Demo Mode" pill signals that
authentication + Supabase RLS arrive in production.

## Multi-tenant / white-label

Everything school-specific lives in `src/lib/school.ts` (name, motto, crest,
contacts, photos, session/term) and the `schools` table in
`supabase/schema.sql` (with `primary_color` / `secondary_color` /
`paystack_subaccount_code` for per-school theming and split settlements).
To onboard a new school: add a `schools` row, seed levels/classes/fee
templates, and swap the config.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor. The frontend only reads
the views: `v_dashboard_totals`, `v_class_fee_summary`, `v_student_balances`,
`v_owing_students`. Money is stored in **kobo** (bigint) and divided by 100
only for display. Invoice totals and statuses are settled by DB triggers —
never by the frontend.

## n8n workflows (`/n8n-workflows`)

Importable JSON, wired to Supabase REST + Resend:

1. **paystack-webhook.json** — verify signature → idempotency check → insert
   `payments` + `payment_allocations` (trigger settles the invoice) →
   `receipts` → notify guardian.
2. **notify-guardian.json** — fetch guardian → switch on preferred channel →
   branded email via Resend (WhatsApp branch queued for later) → log to
   `notifications`.
3. **daily-owing-reminder.json** — Mon/Wed/Fri 8am cron → owing students →
   primary guardians → owing_reminder notifications.
4. **add-student-invoice.json** — student-added webhook → pick fee template
   (new-intake vs returning) → generate invoice + items → notify guardian.

Instance env vars: `PAYSTACK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`,
`SCHOOL_ID`, `CURRENT_TERM_ID`, `CURRENT_TERM_DUE_DATE`, `RESEND_API_KEY`,
`NOTIFY_FROM_EMAIL`, `N8N_BASE_URL`.

---

Powered by **Nalto**.

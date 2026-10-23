-- YOWA sales data.
--
-- Run this once in the Supabase SQL editor.
--
-- Until now an order existed only inside the Paystack transaction that paid for
-- it. That made the shop's own record of a sale depend on holding the right
-- Paystack key, in the right mode, and on the payment actually completing — so a
-- buyer whose payment stopped half way simply could not be found. This table is
-- the shop's own record: /api/checkout writes a row the moment a buyer starts
-- paying, and /api/verify writes back whether the money arrived.

create table if not exists public.yowa_orders (
  reference     text primary key,              -- Paystack reference, ties the two together
  created_at    timestamptz not null default now(),
  paid_at       timestamptz,                   -- when Paystack confirmed it
  status        text        not null default 'pending',  -- pending | success | failed | abandoned
  amount        integer     not null default 0,          -- naira, what they were charged
  subtotal      integer     not null default 0,          -- naira, the clothes alone
  delivery_fee  integer     not null default 0,          -- naira, 0 for pickup
  fulfil        text        not null default 'delivery', -- delivery | pickup
  name          text,
  email         text,
  phone         text,
  address       text,
  state         text,
  lga           text,
  items         text,                          -- the order lines, pipe separated
  delivered_at  timestamptz                    -- set when you mark it delivered
);

create index if not exists yowa_orders_created_idx on public.yowa_orders (created_at desc);
create index if not exists yowa_orders_status_idx  on public.yowa_orders (status);

-- This table holds buyers' names, phone numbers and home addresses, and the
-- shop's anon key is published in the page where anyone can read it. Row level
-- security with no policy means the anon key can touch nothing here: only the
-- service key, which bypasses RLS and lives server-side, can read or write.
-- Do not add a policy for anon.
alter table public.yowa_orders enable row level security;

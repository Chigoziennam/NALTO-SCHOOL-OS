create extension if not exists "pgcrypto";
 
-- ---------- ENUMS ----------
create type invoice_status as enum ('draft','issued','part_paid','paid','overdue','cancelled');
create type payment_status as enum ('pending','success','failed','refunded');
create type payment_channel as enum ('paystack','bank_transfer','cash','pos','cheque');
create type student_status as enum ('active','graduated','withdrawn','suspended');
create type notify_channel as enum ('email','whatsapp','sms');
create type user_role as enum ('super_admin','school_admin','bursar','clerk','parent');
 
-- ============================================================
-- 1. SCHOOLS (multi-tenant root — reusable for other schools)
-- ============================================================
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,                          -- "Archangels' Schools"
  short_code text not null unique,             -- "ARCH"
  motto text,                                  -- "Dedicated to Excellence"
  address text,                                -- "1 Mission Street, Satellite Town, Lagos"
  phone_primary text,
  phone_secondary text,
  email text,
  logo_url text,
  primary_color text,                          -- hex, for white-label theming
  secondary_color text,
  paystack_subaccount_code text,               -- future: split settlements per school
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
 
-- ============================================================
-- 2. ACADEMIC SESSIONS  (e.g. 2025/2026)
-- ============================================================
create table academic_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  name text not null,                          -- "2025/2026"
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);
create index idx_sessions_school on academic_sessions(school_id);
 
-- ============================================================
-- 3. TERMS  (First / Second / Third within a session)
-- ============================================================
create table terms (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references academic_sessions(id),
  name text not null,                          -- "First Term"
  term_number smallint not null check (term_number between 1 and 3),
  start_date date not null,
  end_date date not null,
  fee_due_date date,                           -- when fees become "overdue"
  is_current boolean not null default false,
  unique (session_id, term_number)
);
create index idx_terms_session on terms(session_id);
 
-- ============================================================
-- 4. LEVELS  (KG1, Nursery 1, Primary 1..6, JSS1..3, SS1..3)
-- ============================================================
create table levels (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  name text not null,                          -- "JSS1"
  arm text not null,                           -- 'nursery' | 'primary' | 'college'
  rank smallint not null,                      -- for ordering: KG1=1 ... SS3=15
  unique (school_id, name)
);
create index idx_levels_school on levels(school_id);
 
-- ============================================================
-- 5. CLASSES  (JSS1 Gold, Primary 4 Blue — level + arm label)
-- ============================================================
create table classes (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references levels(id),
  session_id uuid not null references academic_sessions(id),
  name text not null,                          -- "JSS1 Gold"
  class_teacher text,
  unique (level_id, session_id, name)
);
create index idx_classes_level on classes(level_id);
 
-- ============================================================
-- 6. GUARDIANS (parents)
-- ============================================================
create table guardians (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  auth_user_id uuid,                           -- links to auth.users when auth is enabled (nullable for demo)
  full_name text not null,
  phone text not null,
  whatsapp_phone text,
  email text,
  preferred_channel notify_channel not null default 'email',  -- swap to whatsapp later, zero migration
  address text,
  created_at timestamptz not null default now(),
  unique (school_id, phone)
);
create index idx_guardians_school on guardians(school_id);
create index idx_guardians_phone on guardians(phone);
 
-- ============================================================
-- 7. STUDENTS
-- ============================================================
create table students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  admission_number text not null,              -- reuse existing portal admission no. for easy integration
  first_name text not null,
  last_name text not null,
  middle_name text,
  gender text check (gender in ('male','female')),
  date_of_birth date,
  photo_url text,
  current_class_id uuid references classes(id),
  is_new_intake boolean not null default false,  -- drives "new intake" fee templates (JSS1/SS1)
  status student_status not null default 'active',
  enrolled_at date default current_date,
  created_at timestamptz not null default now(),
  unique (school_id, admission_number)
);
create index idx_students_school on students(school_id);
create index idx_students_class on students(current_class_id);
create index idx_students_status on students(status);
 
-- ============================================================
-- 8. STUDENT ↔ GUARDIAN LINKS (many-to-many)
-- ============================================================
create table student_guardians (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  guardian_id uuid not null references guardians(id) on delete cascade,
  relationship text not null default 'parent', -- father/mother/guardian/sponsor
  is_primary boolean not null default false,   -- who receives invoices & receipts
  unique (student_id, guardian_id)
);
create index idx_sg_guardian on student_guardians(guardian_id);
create index idx_sg_student on student_guardians(student_id);
 
-- ============================================================
-- 9. FEE ITEM CATALOG (master list of chargeable items)
-- ============================================================
create table fee_items (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  code text not null,          -- 'TUITION','DEV_LEVY','STATIONERY','LESSON','EXTRA_CURR',
                               -- 'EXAMS','TEXTBOOKS','UNIFORM','ICT','LIBRARY','PRACTICALS',
                               -- 'LAB_COAT','GRAD_LEVY','ENTRANCE','OTHER'
  name text not null,          -- "Development / Maintenance Levy"
  is_recurring boolean not null default true,   -- false for one-offs like entrance, uniform, lab coat
  unique (school_id, code)
);
 
-- ============================================================
-- 10. FEE TEMPLATES (per level + term + intake type)
--     e.g. "JSS1 New Intake — First Term 2025/2026"
-- ============================================================
create table fee_templates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  level_id uuid not null references levels(id),
  term_id uuid not null references terms(id),
  name text not null,
  applies_to text not null default 'all'
    check (applies_to in ('all','new_intake','returning')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (level_id, term_id, applies_to)
);
create index idx_templates_level_term on fee_templates(level_id, term_id);
 
-- ============================================================
-- 11. FEE TEMPLATE ITEMS (line items with amounts in KOBO)
-- ============================================================
create table fee_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references fee_templates(id) on delete cascade,
  fee_item_id uuid not null references fee_items(id),
  amount_kobo bigint not null check (amount_kobo >= 0),
  is_optional boolean not null default false,  -- e.g. lesson/extension may be optional
  unique (template_id, fee_item_id)
);
create index idx_fti_template on fee_template_items(template_id);
 
-- ============================================================
-- 12. INVOICES (one per student per term, generated from template)
-- ============================================================
create table invoices (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  invoice_number text not null,                -- 'ARCH-2526-T1-00042' (generate in n8n)
  student_id uuid not null references students(id),
  term_id uuid not null references terms(id),
  template_id uuid references fee_templates(id),
  total_kobo bigint not null default 0,
  discount_kobo bigint not null default 0,     -- scholarships / sibling discounts
  status invoice_status not null default 'issued',
  due_date date,
  issued_at timestamptz not null default now(),
  notes text,
  unique (school_id, invoice_number),
  unique (student_id, term_id)                 -- one invoice per student per term
);
create index idx_invoices_student on invoices(student_id);
create index idx_invoices_term_status on invoices(term_id, status);
 
-- ============================================================
-- 13. INVOICE ITEMS (snapshot of template lines — never mutate
--     template after issuing; edit the invoice items instead)
-- ============================================================
create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  fee_item_id uuid not null references fee_items(id),
  description text not null,
  amount_kobo bigint not null check (amount_kobo >= 0)
);
create index idx_invitems_invoice on invoice_items(invoice_id);
 
-- ============================================================
-- 14. PAYMENTS (one row per Paystack transaction / bank deposit)
-- ============================================================
create table payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  guardian_id uuid references guardians(id),
  student_id uuid references students(id),
  amount_kobo bigint not null check (amount_kobo > 0),
  channel payment_channel not null default 'paystack',
  status payment_status not null default 'pending',
  paystack_reference text unique,              -- idempotency key for webhook
  paystack_authorization jsonb,                -- raw gateway payload for audit
  paid_at timestamptz,
  recorded_by uuid,                            -- app_users.id for manual cash/POS entries
  created_at timestamptz not null default now()
);
create index idx_payments_student on payments(student_id);
create index idx_payments_status on payments(status);
create index idx_payments_ref on payments(paystack_reference);
 
-- ============================================================
-- 15. PAYMENT ALLOCATIONS (split one payment across invoices —
--     e.g. parent pays ₦300k covering two children at once)
-- ============================================================
create table payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete cascade,
  invoice_id uuid not null references invoices(id),
  amount_kobo bigint not null check (amount_kobo > 0),
  created_at timestamptz not null default now(),
  unique (payment_id, invoice_id)
);
create index idx_alloc_invoice on payment_allocations(invoice_id);
 
-- ============================================================
-- 16. RECEIPTS
-- ============================================================
create table receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) unique,
  receipt_number text not null unique,         -- 'RCP-ARCH-2026-00311'
  pdf_url text,                                -- Supabase Storage path
  issued_at timestamptz not null default now()
);
 
-- ============================================================
-- 17. APP USERS & ROLES (staff side; parents live in guardians)
-- ============================================================
create table app_users (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id),       -- null for super_admin (your parent company)
  auth_user_id uuid,                           -- links to auth.users in production
  full_name text not null,
  email text not null unique,
  role user_role not null default 'bursar',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_users_school on app_users(school_id);
 
-- ============================================================
-- 18. NOTIFICATIONS LOG (email now, WhatsApp later — same table)
-- ============================================================
create table notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  guardian_id uuid references guardians(id),
  channel notify_channel not null,
  template_key text not null,                  -- 'payment_receipt','invoice_issued','owing_reminder'
  payload jsonb,
  status text not null default 'queued'
    check (status in ('queued','sent','failed')),
  provider_message_id text,                    -- Resend id now, Twilio SID later
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notif_guardian on notifications(guardian_id);
 
-- ============================================================
-- 19. AUDIT LOGS (who changed what — bursars handle real money)
-- ============================================================
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id),
  actor_user_id uuid references app_users(id),
  action text not null,                        -- 'invoice.edited','payment.recorded','student.added'
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_entity on audit_logs(entity_type, entity_id);
create index idx_audit_actor on audit_logs(actor_user_id);
 
-- ============================================================
-- TRIGGER: keep invoice.status & totals correct automatically.
-- Deterministic DB logic — never trust the frontend for money.
-- ============================================================
create or replace function fn_refresh_invoice_status() returns trigger as $$
declare
  v_invoice uuid;
  v_total bigint;
  v_discount bigint;
  v_paid bigint;
begin
  v_invoice := coalesce(new.invoice_id, old.invoice_id);
 
  select i.total_kobo, i.discount_kobo into v_total, v_discount
  from invoices i where i.id = v_invoice;
 
  select coalesce(sum(pa.amount_kobo),0) into v_paid
  from payment_allocations pa
  join payments p on p.id = pa.payment_id and p.status = 'success'
  where pa.invoice_id = v_invoice;
 
  update invoices set status =
    case
      when v_paid >= (v_total - v_discount) and v_total > 0 then 'paid'::invoice_status
      when v_paid > 0 then 'part_paid'::invoice_status
      when due_date is not null and due_date < current_date then 'overdue'::invoice_status
      else 'issued'::invoice_status
    end
  where id = v_invoice;
  return null;
end; $$ language plpgsql;
 
create trigger trg_alloc_refresh
after insert or update or delete on payment_allocations
for each row execute function fn_refresh_invoice_status();
 
-- Auto-compute invoice total from its items
create or replace function fn_refresh_invoice_total() returns trigger as $$
begin
  update invoices set total_kobo = (
    select coalesce(sum(amount_kobo),0) from invoice_items
    where invoice_id = coalesce(new.invoice_id, old.invoice_id)
  ) where id = coalesce(new.invoice_id, old.invoice_id);
  return null;
end; $$ language plpgsql;
 
create trigger trg_items_total
after insert or update or delete on invoice_items
for each row execute function fn_refresh_invoice_total();
 
-- ============================================================
-- VIEWS — paid / owing / part-paid / dashboard (the demo magic)
-- ============================================================
 
-- Per-student balance for the current term
create or replace view v_student_balances as
select
  s.id as student_id,
  s.school_id,
  s.admission_number,
  s.first_name || ' ' || s.last_name as student_name,
  c.name as class_name,
  l.name as level_name,
  i.id as invoice_id,
  i.term_id,
  (i.total_kobo - i.discount_kobo) as billed_kobo,
  coalesce(paid.paid_kobo, 0) as paid_kobo,
  (i.total_kobo - i.discount_kobo) - coalesce(paid.paid_kobo,0) as balance_kobo,
  i.status as invoice_status
from students s
join invoices i on i.student_id = s.id
left join classes c on c.id = s.current_class_id
left join levels l on l.id = c.level_id
left join lateral (
  select sum(pa.amount_kobo) as paid_kobo
  from payment_allocations pa
  join payments p on p.id = pa.payment_id and p.status = 'success'
  where pa.invoice_id = i.id
) paid on true
where s.status = 'active';
 
-- Fully paid students (current term filter applied in query)
create or replace view v_paid_students as
select * from v_student_balances where balance_kobo <= 0;
 
-- Owing students (nothing paid at all)
create or replace view v_owing_students as
select * from v_student_balances where paid_kobo = 0 and balance_kobo > 0;
 
-- Part-paid students
create or replace view v_part_paid_students as
select * from v_student_balances where paid_kobo > 0 and balance_kobo > 0;
 
-- Class-level counts (feeds the bursar's class breakdown table)
create or replace view v_class_fee_summary as
select
  school_id, term_id, class_name, level_name,
  count(*) as student_count,
  count(*) filter (where balance_kobo <= 0) as paid_count,
  count(*) filter (where paid_kobo > 0 and balance_kobo > 0) as part_paid_count,
  count(*) filter (where paid_kobo = 0 and balance_kobo > 0) as owing_count,
  sum(billed_kobo) as total_billed_kobo,
  sum(paid_kobo) as total_paid_kobo,
  sum(greatest(balance_kobo,0)) as total_outstanding_kobo
from v_student_balances
group by school_id, term_id, class_name, level_name;
 
-- Live dashboard totals (feeds the animated counters)
create or replace view v_dashboard_totals as
select
  school_id, term_id,
  count(*) as active_students,
  count(*) filter (where balance_kobo <= 0) as paid_students,
  count(*) filter (where paid_kobo > 0 and balance_kobo > 0) as part_paid_students,
  count(*) filter (where paid_kobo = 0 and balance_kobo > 0) as owing_students,
  sum(billed_kobo) as total_billed_kobo,
  sum(paid_kobo) as total_collected_kobo,
  sum(greatest(balance_kobo,0)) as total_outstanding_kobo,
  round(100.0 * sum(paid_kobo) / nullif(sum(billed_kobo),0), 1) as collection_rate_pct
from v_student_balances
group by school_id, term_id;

import type {
  ChildBalance, ClassOption, ClassSummary, DashboardTotals, Guardian,
  InvoiceDetail, OwingStudent, PaymentRow,
} from './types'

/* =====================================================================
   Demo seed — mirrors the Supabase views exactly. Every number is
   engineered to cross-foot: the class table sums to the KPI totals.
   ===================================================================== */

const K = 100_000 // ₦1,000 in kobo

export const DEMO_GUARDIAN: Guardian = {
  id: 'demo-guardian-okafor',
  full_name: 'Mrs. Adaeze Okafor',
  phone: '+234 803 555 0147',
  email: 'adaeze.okafor@gmail.com',
}

export const DEMO_TOTALS: DashboardTotals = {
  active_students: 60,
  paid_students: 38,
  part_paid_students: 13,
  owing_students: 9,
  total_billed_kobo: 14_200_000 * 100,
  total_collected_kobo: 11_100_000 * 100,
  total_outstanding_kobo: 3_100_000 * 100,
  collection_rate_pct: 78.2,
}

/* students, paid, part, owing, billed(₦k), collected(₦k) — sums: 60/38/13/9, 14,200k / 11,100k */
const CLASS_ROWS: [string, string, number, number, number, number, number, number][] = [
  ['KG1', 'KG1', 4, 3, 1, 0, 480, 375],
  ['Nursery 1', 'Nursery 1', 4, 3, 0, 1, 520, 405],
  ['Nursery 2', 'Nursery 2', 4, 3, 1, 0, 520, 410],
  ['Primary 1', 'Primary 1', 4, 3, 1, 0, 600, 470],
  ['Primary 2', 'Primary 2', 4, 2, 1, 1, 600, 465],
  ['Primary 3', 'Primary 3', 4, 3, 0, 1, 600, 470],
  ['Primary 4', 'Primary 4', 4, 3, 1, 0, 640, 500],
  ['Primary 5', 'Primary 5', 4, 2, 1, 1, 640, 500],
  ['Primary 6', 'Primary 6', 4, 3, 1, 0, 680, 535],
  ['JSS1 Gold', 'JSS1', 4, 2, 1, 1, 1300, 1015],
  ['JSS2 Gold', 'JSS2', 4, 2, 1, 1, 1300, 1010],
  ['JSS3 Gold', 'JSS3', 4, 3, 1, 0, 1300, 1020],
  ['SS1 Gold', 'SS1', 4, 2, 1, 1, 1600, 1250],
  ['SS2 Gold', 'SS2', 4, 2, 1, 1, 1600, 1255],
  ['SS3 Gold', 'SS3', 4, 2, 1, 1, 1820, 1420],
]

export const DEMO_CLASS_SUMMARY: ClassSummary[] = CLASS_ROWS.map(
  ([class_name, level_name, student_count, paid_count, part_paid_count, owing_count, billedK, collectedK]) => ({
    class_name,
    level_name,
    student_count,
    paid_count,
    part_paid_count,
    owing_count,
    total_billed_kobo: billedK * K,
    total_paid_kobo: collectedK * K,
    total_outstanding_kobo: (billedK - collectedK) * K,
  }),
)

export const DEMO_CLASS_OPTIONS: ClassOption[] = CLASS_ROWS.map(([name]) => ({
  id: 'class-' + name.toLowerCase().replace(/\s+/g, '-'),
  name,
}))

/* ---------------- Parent demo: Mrs. Okafor's two children ---------------- */

export const DEMO_CHILDREN: ChildBalance[] = [
  {
    student_id: 'st-chidera',
    admission_number: 'ARCH/2021/0412',
    student_name: 'Chidera Okafor',
    class_name: 'Primary 4',
    level_name: 'Primary 4',
    invoice_id: 'inv-chidera-t3',
    billed_kobo: 142_500 * 100,
    paid_kobo: 142_500 * 100,
    balance_kobo: 0,
    invoice_status: 'paid',
  },
  {
    student_id: 'st-somto',
    admission_number: 'ARCH/2023/0781',
    student_name: 'Somtochukwu Okafor',
    class_name: 'JSS2 Gold',
    level_name: 'JSS2',
    invoice_id: 'inv-somto-t3',
    billed_kobo: 187_500 * 100,
    paid_kobo: 0,
    balance_kobo: 187_500 * 100,
    invoice_status: 'issued',
  },
]

export const DEMO_INVOICES: Record<string, InvoiceDetail> = {
  'inv-somto-t3': {
    id: 'inv-somto-t3',
    invoice_number: 'ARCH-2526-T3-00781',
    student_name: 'Somtochukwu Okafor',
    admission_number: 'ARCH/2023/0781',
    class_name: 'JSS2 Gold',
    issued_at: '2026-05-04T09:00:00Z',
    due_date: '2026-06-12',
    items: [
      { id: 'li-1', description: 'Tuition', amount_kobo: 95_000 * 100 },
      { id: 'li-2', description: 'Development / Maintenance Levy', amount_kobo: 20_000 * 100 },
      { id: 'li-3', description: 'Textbooks', amount_kobo: 22_500 * 100 },
      { id: 'li-4', description: 'ICT', amount_kobo: 12_500 * 100 },
      { id: 'li-5', description: 'Examination', amount_kobo: 10_000 * 100 },
      { id: 'li-6', description: 'Lesson', amount_kobo: 10_000 * 100 },
      { id: 'li-7', description: 'Stationery', amount_kobo: 7_500 * 100 },
      { id: 'li-8', description: 'Extra-Curricular', amount_kobo: 5_000 * 100 },
      { id: 'li-9', description: 'Library', amount_kobo: 5_000 * 100 },
    ],
    total_kobo: 187_500 * 100,
    discount_kobo: 0,
    paid_kobo: 0,
    balance_kobo: 187_500 * 100,
    status: 'issued',
  },
  'inv-chidera-t3': {
    id: 'inv-chidera-t3',
    invoice_number: 'ARCH-2526-T3-00412',
    student_name: 'Chidera Okafor',
    admission_number: 'ARCH/2021/0412',
    class_name: 'Primary 4',
    issued_at: '2026-05-04T09:00:00Z',
    due_date: '2026-06-12',
    items: [
      { id: 'li-1', description: 'Tuition', amount_kobo: 78_000 * 100 },
      { id: 'li-2', description: 'Development / Maintenance Levy', amount_kobo: 18_000 * 100 },
      { id: 'li-3', description: 'Textbooks', amount_kobo: 16_500 * 100 },
      { id: 'li-4', description: 'ICT', amount_kobo: 9_000 * 100 },
      { id: 'li-5', description: 'Examination', amount_kobo: 7_500 * 100 },
      { id: 'li-6', description: 'Stationery', amount_kobo: 6_000 * 100 },
      { id: 'li-7', description: 'Extra-Curricular', amount_kobo: 4_000 * 100 },
      { id: 'li-8', description: 'Library', amount_kobo: 3_500 * 100 },
    ],
    total_kobo: 142_500 * 100,
    discount_kobo: 0,
    paid_kobo: 142_500 * 100,
    balance_kobo: 0,
    status: 'paid',
  },
}

export const DEMO_PARENT_HISTORY: PaymentRow[] = [
  {
    id: 'pay-h1',
    student_name: 'Chidera Okafor',
    guardian_name: DEMO_GUARDIAN.full_name,
    amount_kobo: 142_500 * 100,
    channel: 'paystack',
    paid_at: '2026-05-09T11:24:00Z',
    description: 'Third Term fees — Primary 4 (full payment)',
    receipt_number: 'RCP-ARCH-2026-30917',
  },
  {
    id: 'pay-h2',
    student_name: 'Somtochukwu Okafor',
    guardian_name: DEMO_GUARDIAN.full_name,
    amount_kobo: 176_000 * 100,
    channel: 'bank_transfer',
    paid_at: '2026-01-16T08:41:00Z',
    description: 'Second Term fees — JSS2 (full payment)',
    receipt_number: 'RCP-ARCH-2026-20443',
  },
  {
    id: 'pay-h3',
    student_name: 'Chidera Okafor',
    guardian_name: DEMO_GUARDIAN.full_name,
    amount_kobo: 138_000 * 100,
    channel: 'paystack',
    paid_at: '2026-01-12T15:02:00Z',
    description: 'Second Term fees — Primary 4 (full payment)',
    receipt_number: 'RCP-ARCH-2026-20101',
  },
  {
    id: 'pay-h4',
    student_name: 'Somtochukwu Okafor',
    guardian_name: DEMO_GUARDIAN.full_name,
    amount_kobo: 181_500 * 100,
    channel: 'paystack',
    paid_at: '2025-09-19T10:15:00Z',
    description: 'First Term fees — JSS2 (full payment)',
    receipt_number: 'RCP-ARCH-2025-10876',
  },
]

/* ---------------- Bursar: recent payments feed ---------------- */

const now = Date.now()
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString()

export const DEMO_RECENT_PAYMENTS: PaymentRow[] = [
  { id: 'rp-1', student_name: 'Tamuno Briggs', guardian_name: 'Mrs. Ibiere Briggs', amount_kobo: 325_000 * 100, channel: 'paystack', paid_at: minsAgo(12) },
  { id: 'rp-2', student_name: 'Aisha Bello', guardian_name: 'Alhaji Bello', amount_kobo: 187_500 * 100, channel: 'bank_transfer', paid_at: minsAgo(47) },
  { id: 'rp-3', student_name: 'Chukwuemeka Nnadi', guardian_name: 'Dr. Nnadi', amount_kobo: 120_000 * 100, channel: 'pos', paid_at: minsAgo(95) },
  { id: 'rp-4', student_name: 'Zainab Yusuf', guardian_name: 'Mr. Kabir Yusuf', amount_kobo: 455_000 * 100, channel: 'paystack', paid_at: minsAgo(160) },
  { id: 'rp-5', student_name: 'Oluwaseun Adé', guardian_name: 'Mrs. Funke Adé', amount_kobo: 90_000 * 100, channel: 'cash', paid_at: minsAgo(210) },
  { id: 'rp-6', student_name: 'Ifeoma Eze', guardian_name: 'Mr. Obinna Eze', amount_kobo: 150_000 * 100, channel: 'paystack', paid_at: minsAgo(300) },
  { id: 'rp-7', student_name: 'Musa Danjuma', guardian_name: 'Mrs. Hauwa Danjuma', amount_kobo: 227_500 * 100, channel: 'bank_transfer', paid_at: minsAgo(430) },
  { id: 'rp-8', student_name: 'Grace Effiong', guardian_name: 'Pastor Effiong', amount_kobo: 400_000 * 100, channel: 'paystack', paid_at: minsAgo(520) },
  { id: 'rp-9', student_name: 'Kelechi Umeh', guardian_name: 'Mr. Kingsley Umeh', amount_kobo: 130_000 * 100, channel: 'pos', paid_at: minsAgo(600) },
  { id: 'rp-10', student_name: 'Blessing Lawal', guardian_name: 'Mrs. Ronke Lawal', amount_kobo: 162_500 * 100, channel: 'paystack', paid_at: minsAgo(690) },
]

/* ---------------- Owing students (report page) ---------------- */

export const DEMO_OWING: OwingStudent[] = [
  { student_name: 'Somtochukwu Okafor', class_name: 'JSS2 Gold', balance_kobo: 187_500 * 100, guardian_name: 'Mrs. Adaeze Okafor', guardian_phone: '+234 803 555 0147' },
  { student_name: 'Nkechi Abubakar', class_name: 'Nursery 1', balance_kobo: 115_000 * 100, guardian_name: 'Mr. Sani Abubakar', guardian_phone: '+234 805 221 8830' },
  { student_name: 'Femi Balogun', class_name: 'Primary 2', balance_kobo: 135_000 * 100, guardian_name: 'Mrs. Yetunde Balogun', guardian_phone: '+234 812 407 5511' },
  { student_name: 'Ada Okonkwo', class_name: 'Primary 3', balance_kobo: 130_000 * 100, guardian_name: 'Mr. Ikenna Okonkwo', guardian_phone: '+234 703 990 2216' },
  { student_name: 'Ibrahim Chukwu', class_name: 'Primary 5', balance_kobo: 140_000 * 100, guardian_name: 'Mrs. Amara Chukwu', guardian_phone: '+234 809 116 4472' },
  { student_name: 'Tunde Bassey', class_name: 'JSS1 Gold', balance_kobo: 285_000 * 100, guardian_name: 'Mr. Etim Bassey', guardian_phone: '+234 802 664 1093' },
  { student_name: 'Seun Danjuma', class_name: 'SS1 Gold', balance_kobo: 350_000 * 100, guardian_name: 'Mrs. Hauwa Danjuma', guardian_phone: '+234 806 313 7754' },
  { student_name: 'Uche Effiong', class_name: 'SS2 Gold', balance_kobo: 345_000 * 100, guardian_name: 'Pastor Effiong', guardian_phone: '+234 810 552 9038' },
  { student_name: 'Bola Yusuf', class_name: 'SS3 Gold', balance_kobo: 400_000 * 100, guardian_name: 'Mr. Kabir Yusuf', guardian_phone: '+234 813 228 6641' },
]

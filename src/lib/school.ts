/**
 * White-label school configuration.
 * NALTO SchoolOS is multi-tenant: to onboard another school, add a row to the
 * `schools` table and swap this config (or load it from Supabase by short_code).
 */
export interface SchoolConfig {
  shortCode: string
  name: string
  motto: string
  address: string
  phonePrimary: string
  phoneSecondary: string
  email: string
  /** Digits only, international format for wa.me links (no + or spaces). */
  whatsapp: string
  /** Google Maps embed src + a directions deep-link. */
  mapEmbedSrc: string
  mapDirectionsUrl: string
  /** Remote crest with local fallback (see <CrestImg />). */
  logoUrl: string
  logoFallback: string
  websiteUrl: string
  currentSession: string
  currentTerm: string
  /** Campus imagery — remote first, graceful gradient fallback. */
  campusPhotos: { src: string; caption: string }[]
  aboutPhoto: string
  ctaPhoto: string
}

export const SCHOOL: SchoolConfig = {
  shortCode: 'ARCH',
  name: "Archangels' Schools",
  motto: 'Dedicated to Excellence',
  address: '1 Mission Street, Satellite Town, Lagos',
  phonePrimary: '+234 906 705 5706',
  phoneSecondary: '+234 806 470 9091',
  email: 'info@archangelschools.org.ng',
  whatsapp: '2349067055706',
  mapEmbedSrc:
    'https://www.google.com/maps?q=Satellite+Town+Lagos+Nigeria&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Satellite+Town+Lagos+Nigeria',
  logoUrl: 'https://www.archangelschools.org.ng/images/logo.png',
  logoFallback: '/assets/logo.svg',
  websiteUrl: 'https://www.archangelschools.org.ng',
  currentSession: '2025/2026',
  currentTerm: 'Third Term',
  /* Sourced from archangelschools.org.ng (home + facilities + college gallery).
     Add more entries by pasting img URLs from /college/gallery.php. */
  campusPhotos: [
    { src: 'https://www.archangelschools.org.ng/pictures/home/14602837641576341703.jpg', caption: 'College Assembly' },
    { src: 'https://www.archangelschools.org.ng/pictures/home/11812905191576340434.jpg', caption: 'Cultural Fiesta' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/5162847261587556657.jpg', caption: 'ICT Room' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/11454929711588600766.jpg', caption: 'School Hall' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/6088929451587556615.jpg', caption: 'Play Lawn' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/14386600131587557366.jpg', caption: 'School Library' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/3435339091587557256.jpg', caption: 'Play Ground' },
    { src: 'https://www.archangelschools.org.ng/pictures/home/17613630811576340556.jpg', caption: 'School Grounds' },
  ],
  aboutPhoto: 'https://www.archangelschools.org.ng/pictures/home/11812905191576340434.jpg',
  ctaPhoto: 'https://www.archangelschools.org.ng/pictures/home/17613630811576340556.jpg',
}

/* ------------------------------------------------------------------ *
 * Academic programs — the three sections parents choose between.
 * ------------------------------------------------------------------ */
export interface Program {
  id: string
  name: string
  ages: string
  tagline: string
  blurb: string
  subjects: string[]
}

export const PROGRAMS: Program[] = [
  {
    id: 'nursery',
    name: 'Nursery / Early Years',
    ages: 'Ages 2 – 5',
    tagline: 'Where the journey begins',
    blurb:
      'A warm, play-based foundation that builds confidence, curiosity and early literacy & numeracy through structured Montessori-inspired learning.',
    subjects: ['Phonics & Reading', 'Number Work', 'Rhymes & Music', 'Creative Play', 'Moral Instruction', 'Motor Skills'],
  },
  {
    id: 'primary',
    name: 'Primary School',
    ages: 'Ages 6 – 11',
    tagline: 'Building strong foundations',
    blurb:
      'A rich, well-rounded primary curriculum blending the Nigerian and British systems, preparing pupils for Common Entrance with strong character formation.',
    subjects: ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Computer Studies', 'Verbal & Quantitative Reasoning', 'French', 'Christian Religious Studies'],
  },
  {
    id: 'college',
    name: 'College / Secondary',
    ages: 'Ages 11 – 17',
    tagline: 'Excellence to graduation',
    blurb:
      'Junior & Senior Secondary preparing students for BECE, WAEC, NECO and JAMB across Science, Arts and Commercial tracks under Redemptorist (C.Ss.R) leadership.',
    subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature', 'Further Maths', 'Data Processing'],
  },
]

/* ------------------------------------------------------------------ *
 * School life — activities & clubs shown on the public site.
 * ------------------------------------------------------------------ */
export interface Activity {
  id: string
  title: string
  body: string
  /** lucide-react icon name resolved in the component. */
  icon: 'Trophy' | 'Music' | 'FlaskConical' | 'BookOpen' | 'Church' | 'Palette' | 'Globe2' | 'Users'
}

export const ACTIVITIES: Activity[] = [
  { id: 'sports', title: 'Sports & Athletics', body: 'Inter-house sports, football, athletics and an annual Cultural & Sports Fiesta.', icon: 'Trophy' },
  { id: 'ict', title: 'ICT & Robotics', body: 'A fully-equipped ICT lab, coding club and digital-literacy from Primary upward.', icon: 'FlaskConical' },
  { id: 'music', title: 'Music & Drama', body: 'School choir, band, and stage productions that showcase every child’s talent.', icon: 'Music' },
  { id: 'faith', title: 'Faith & Character', body: 'Daily assembly, chaplaincy and moral instruction under Redemptorist guidance.', icon: 'Church' },
  { id: 'clubs', title: 'Clubs & Societies', body: 'Press club, debate, JETS, Red Cross, Scripture Union and cultural societies.', icon: 'Users' },
  { id: 'excursions', title: 'Excursions & Field Trips', body: 'Educational visits that connect classroom learning to the real world.', icon: 'Globe2' },
]

/* ------------------------------------------------------------------ *
 * Admissions — the online-application flow.
 * ------------------------------------------------------------------ */
export const ADMISSION_STEPS = [
  { n: '01', title: 'Apply Online', body: 'Complete the form below with your child’s and guardian details — no need to visit the school.' },
  { n: '02', title: 'Upload Documents', body: 'Attach birth certificate, passport photo and last report card (optional at this stage).' },
  { n: '03', title: 'Assessment', body: 'We invite your child for a short entrance assessment and a friendly interview.' },
  { n: '04', title: 'Offer & Enrolment', body: 'On success you receive an admission letter — pay the acceptance fee online and you’re in.' },
]

export const ADMISSION_REQUIREMENTS = [
  'Completed online application form',
  'Child’s birth certificate',
  'Two recent passport photographs',
  'Last school report / result (for transfers)',
  'Immunisation / medical record',
]

export const CLASS_APPLYING = [
  'Crèche', 'Pre-Nursery', 'Nursery 1', 'Nursery 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3',
]

/* ------------------------------------------------------------------ *
 * Fees — termly tuition per class (in naira). Used by the self-serve
 * "Pay School Fees" page to auto-fill the amount due.
 * ------------------------------------------------------------------ */
export const TERMS = ['First Term', 'Second Term', 'Third Term'] as const

/** Termly fee in NAIRA, keyed by class name. */
export const FEE_TABLE: Record<string, number> = {
  'Crèche': 75_000, 'Pre-Nursery': 80_000, 'Nursery 1': 85_000, 'Nursery 2': 85_000,
  'Primary 1': 110_000, 'Primary 2': 110_000, 'Primary 3': 115_000,
  'Primary 4': 115_000, 'Primary 5': 120_000, 'Primary 6': 120_000,
  'JSS 1': 135_000, 'JSS 2': 135_000, 'JSS 3': 140_000,
  'SS 1': 150_000, 'SS 2': 150_000, 'SS 3': 155_000,
}

/** Termly fee in NAIRA for a class (0 if unknown). */
export function feeForClass(className: string): number {
  return FEE_TABLE[className] ?? 0
}

/* ------------------------------------------------------------------ *
 * School store — uniforms + merchandise categories (upsell).
 * ------------------------------------------------------------------ */
export interface StoreCategory {
  id: string
  name: string
  note: string
  icon: 'Shirt' | 'BookOpen' | 'Backpack' | 'Dumbbell'
}

export const STORE_CATEGORIES: StoreCategory[] = [
  { id: 'uniform', name: 'Uniforms', note: 'Day, sports & house wear', icon: 'Shirt' },
  { id: 'books', name: 'Textbooks & Stationery', note: 'Per-class booklists', icon: 'BookOpen' },
  { id: 'bags', name: 'School Bags', note: 'Crested backpacks', icon: 'Backpack' },
  { id: 'sports', name: 'Sportswear & Kits', note: 'House-colour sets', icon: 'Dumbbell' },
]

/** A buyable store item. `photo` is tried first; on error the card falls back
 *  to the built-in <UniformArt kind> illustration so it never renders empty. */
export interface StoreItem {
  id: string
  name: string
  priceNaira: number
  /** matches UniformArt's ArtKind for the illustrated fallback */
  kind: 'boys' | 'girls' | 'sports' | 'cardigan' | 'tie' | 'socks'
  note: string
  photo?: string
}

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`

/* Clothing items render the built-in illustrations (they accurately show the
 * check shirt / pinafore / tracksuit / cardigan / tie / socks). Only the bag &
 * book packs use real photos, which match those generic products well. */
export const STORE_ITEMS: StoreItem[] = [
  { id: 'uni-boys', name: "Boys' Uniform Set", priceNaira: 18_500, kind: 'boys', note: 'Check shirt + navy shorts/trousers' },
  { id: 'uni-girls', name: "Girls' Pinafore Set", priceNaira: 19_500, kind: 'girls', note: 'Pinafore + check blouse' },
  { id: 'uni-sports', name: 'Sports Wear', priceNaira: 12_000, kind: 'sports', note: 'House-colour tracksuit set' },
  { id: 'uni-bag', name: 'Crested School Bag', priceNaira: 14_000, kind: 'sports', note: 'Durable branded backpack', photo: UNSPLASH('1553062407-98eeb64c6a62') },
  { id: 'uni-books', name: 'Textbook & Stationery Pack', priceNaira: 22_000, kind: 'cardigan', note: 'Full per-class booklist', photo: UNSPLASH('1544716278-ca5e3f4abd8c') },
  { id: 'uni-cardigan', name: 'School Cardigan', priceNaira: 9_500, kind: 'cardigan', note: 'Navy with gold trim' },
  { id: 'uni-tie', name: 'School Tie & Beret', priceNaira: 4_500, kind: 'tie', note: 'Crested — college section' },
  { id: 'uni-socks', name: 'Socks (3 pairs)', priceNaira: 3_000, kind: 'socks', note: 'White with navy band' },
]

/* ------------------------------------------------------------------ *
 * Nalto AI — the knowledge base the assistant is "trained" on.
 * This is the mock workflow data: the demo shows these cards being fed
 * into the assistant, and the chat answers questions strictly from them.
 * ------------------------------------------------------------------ */
export interface KnowledgeEntry {
  id: string
  topic: string
  /** keywords that route a parent question to this answer. */
  keywords: string[]
  question: string
  answer: string
}

export const AI_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'reopen',
    topic: 'Resumption',
    keywords: ['reopen', 'resume', 'resumption', 'start', 'begin', 'term start', 'when does school'],
    question: 'When does school reopen?',
    answer: `The ${SCHOOL.currentTerm} of the ${SCHOOL.currentSession} session resumes on Monday, 8th September. Boarders return the Sunday before. A full calendar is sent to every parent by email.`,
  },
  {
    id: 'fees',
    topic: 'School Fees',
    keywords: ['fee', 'fees', 'tuition', 'cost', 'how much', 'price', 'pay'],
    question: 'How much is tuition and how do I pay?',
    answer: 'Fees vary by section: Nursery from ₦85,000, Primary from ₦110,000 and College from ₦150,000 per term. You can pay securely online from the Parent Portal — tap “Pay School Fees”, select your child and pay by card, transfer or USSD. An official receipt is issued instantly.',
  },
  {
    id: 'admission',
    topic: 'Admissions',
    keywords: ['admission', 'admit', 'apply', 'register', 'enrol', 'enroll', 'documents', 'requirements'],
    question: 'How do I apply and what documents are needed?',
    answer: 'Apply online from the Admissions page — no need to come in. You’ll need your child’s birth certificate, two passport photos, the last report card (for transfers) and an immunisation record. After you submit, we invite your child for a short assessment.',
  },
  {
    id: 'uniform',
    topic: 'Uniforms',
    keywords: ['uniform', 'wear', 'dress', 'kit', 'sportswear', 'buy uniform'],
    question: 'What uniform does my child need?',
    answer: 'Boys wear a check shirt with navy shorts/trousers; girls wear a check blouse with a navy pinafore. Sports days use the house-colour tracksuit. You can order the complete set online from the School Store and collect it at the office.',
  },
  {
    id: 'pta',
    topic: 'PTA',
    keywords: ['pta', 'meeting', 'parent teacher', 'association'],
    question: 'When is the next PTA meeting?',
    answer: 'The next PTA meeting holds on Saturday, 4th October at 10:00am in the College Hall. Agenda and Zoom link are shared by email one week before.',
  },
  {
    id: 'hours',
    topic: 'School Hours',
    keywords: ['time', 'hours', 'open', 'close', 'resume time', 'closing', 'daily'],
    question: 'What are the school hours?',
    answer: 'School runs Monday–Friday, 7:45am to 3:30pm, with an extended-day option until 5:00pm. The office is open on Saturdays from 9:00am to 1:00pm for enquiries and collections.',
  },
  {
    id: 'programs',
    topic: 'Programs',
    keywords: ['program', 'programme', 'class', 'curriculum', 'subject', 'section', 'nursery', 'primary', 'college', 'secondary'],
    question: 'What programs do you offer?',
    answer: 'We run three sections: Nursery/Early Years (ages 2–5), Primary (ages 6–11) and College/Secondary (ages 11–17) with Science, Arts and Commercial tracks preparing students for WAEC, NECO and JAMB.',
  },
  {
    id: 'contact',
    topic: 'Contact',
    keywords: ['contact', 'phone', 'call', 'reach', 'location', 'address', 'where', 'directions', 'whatsapp'],
    question: 'How do I reach the school?',
    answer: `We’re at ${SCHOOL.address}. Call ${SCHOOL.phonePrimary}, email ${SCHOOL.email}, or tap the WhatsApp button to chat with the office directly.`,
  },
]

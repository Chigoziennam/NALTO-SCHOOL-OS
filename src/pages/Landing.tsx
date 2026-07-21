import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CreditCard, FileCheck2, Mail, MapPin, Menu, Phone, Search, Shirt, ChevronDown, X } from 'lucide-react'
import { SCHOOL } from '../lib/school'
import { koboToNaira } from '../lib/format'
import { useDashboardTotals } from '../hooks/useData'
import { CountUp } from '../components/CountUp'
import { Crest, PoweredByNalto } from '../components/Brand'
import { HolyLight } from '../components/HolyLight'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { ScriptureSide, ScriptureCenterSmall } from '../components/Scripture'
import { AngelTouch } from '../components/AngelTouch'
import { UniformArt, type ArtKind } from '../components/UniformArt'
import { PageCanvas, WaveDivider, TeamAvatar } from '../components/LandingChrome'
import { Programs, Activities, AISection, StoreStrip, Directions } from '../components/SchoolSections'
import { NaltoAI } from '../components/NaltoAI'
import { WhatsAppFab } from '../components/WhatsAppFab'
import { GraduationCap } from 'lucide-react'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#programs', label: 'Programs' },
  { href: '#activities', label: 'School Life' },
  { href: '#ai', label: 'Nalto AI' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-navy-950/75 py-2.5 shadow-lg backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Crest className={`transition-all duration-500 ${scrolled ? 'h-8 w-8' : 'h-11 w-11'} drop-shadow-lg`} />
          <div className="leading-tight text-white">
            <div className="font-display text-lg">{SCHOOL.name}</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-300">{SCHOOL.motto}</div>
          </div>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-xs font-semibold uppercase tracking-[0.14em] text-navy-100 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/admissions" className="btn-ghost px-5 py-2.5 text-xs">Apply Online</Link>
          <Link to="/parent" className="btn-accent px-5 py-2.5 text-xs">Pay School Fees</Link>
        </div>
        <button className="text-white sm:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-navy-950/95 px-6 py-5 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wider text-navy-100">
                {l.label}
              </a>
            ))}
            <Link to="/admissions" onClick={() => setOpen(false)} className="btn-accent mt-2 justify-center py-3 text-xs">Apply Online</Link>
            <Link to="/parent" onClick={() => setOpen(false)} className="btn-ghost justify-center py-3 text-xs">Pay School Fees</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

function HeavenHero() {
  const [bgSrc, setBgSrc] = useState(SCHOOL.campusPhotos[0].src)
  return (
    <header id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgSrc}
          alt=""
          aria-hidden
          onError={() => bgSrc !== '/assets/heaven.jpg' && setBgSrc('/assets/heaven.jpg')}
          className="absolute inset-0 h-full w-full animate-ken-burns object-cover"
        />
        <video
          className="absolute inset-0 hidden h-full w-full object-cover opacity-35 mix-blend-screen sm:block"
          autoPlay muted loop playsInline
        >
          <source src="/assets/archangels-hero.mp4" type="video/mp4" />
        </video>
      </div>
      <HolyLight />
      {/* veil for legibility, fading to transparent at the bottom so the page canvas flows straight in */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(10,24,48,0.72) 0%, rgba(10,24,48,0.5) 45%, rgba(10,24,48,0.72) 82%, rgba(10,24,48,1) 100%)' }}
      />

      {/* Scripture rail on the side of the screen */}
      <ScriptureSide startIndex={0} side="right" />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
          {SCHOOL.currentSession} · {SCHOOL.currentTerm}
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="mt-6 font-display text-5xl font-medium leading-[1.08] text-white sm:text-6xl md:text-7xl"
          style={{ textShadow: '0 2px 40px rgba(10,24,48,0.6)' }}
        >
          Archangels&rsquo; Schools
          <br />
          <span className="bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100 bg-clip-text text-transparent">
            Dedicated to Excellence
          </span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
          A private Nursery, Primary &amp; College in Satellite Town, Lagos. Apply for admission,
          pay school fees online and get instant answers — all from your phone.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/parent" className="btn-accent animate-floaty">
            <CreditCard size={17} /> Pay School Fees
          </Link>
          <Link to="/admissions" className="btn-ghost">
            <GraduationCap size={17} /> Apply Online
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.4, duration: 2.4, repeat: Infinity }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </header>
  )
}

function StatsBar() {
  const { data: totals } = useDashboardTotals()
  const stats = [
    { label: 'Collected This Term', value: totals ? koboToNaira(totals.total_collected_kobo) : 0, format: (v: number) => '₦' + (v / 1_000_000).toFixed(1) + 'M' },
    { label: 'Students Fully Paid', value: totals?.paid_students ?? 0 },
    { label: 'Students Owing', value: totals?.owing_students ?? 0 },
    { label: 'Collection Rate', value: totals ? Math.round(totals.collection_rate_pct) : 0, format: (v: number) => v + '%' },
  ]
  return (
    <section className="relative px-6 py-16">
      <motion.div {...inViewRise} className="glass-strong mx-auto grid max-w-5xl grid-cols-2 gap-8 px-8 py-10 text-center md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-mono text-4xl font-semibold text-gold-300 sm:text-5xl" style={{ textShadow: '0 0 28px rgba(201,154,62,0.5)' }}>
              <CountUp value={s.value} format={s.format} />
            </div>
            <div className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-navy-100">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function About() {
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-30, 30])
  return (
    <section id="about" className="relative my-6 flex min-h-[680px] items-end overflow-hidden">
      {!failed && (
        <motion.img
          src={SCHOOL.aboutPhoto}
          alt="Life at Archangels' Schools"
          style={{ y: parallaxY }}
          className="absolute left-[-8%] top-[-8%] h-[126%] w-[116%] max-w-none object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {/* scrim so the words stand out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,24,48,0.94) 0%, rgba(10,24,48,0.7) 44%, rgba(10,24,48,0.25) 70%, rgba(10,24,48,0.1) 100%), linear-gradient(0deg, rgba(10,24,48,0.6) 0%, transparent 45%)',
        }}
      />
      {/* organic waves carry the photo into the canvas — no straight seam */}
      <WaveDivider position="top" />
      <WaveDivider position="bottom" />

      <motion.div {...inViewRise} className="relative z-20 max-w-xl px-6 pb-28 pt-20 sm:px-12 lg:px-20">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-gold-300">Our Mission</div>
        <h2 className="mt-4 text-4xl leading-[1.1] text-white sm:text-5xl" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
          Nurturing every child, morally and academically
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-navy-100">
          An academic institution determined to attain excellence at every level of educational
          pursuit — <strong className="text-white">378 pupils</strong> in Nursery &amp; Primary and{' '}
          <strong className="text-white">679 students</strong> in the College Section, over 100
          dedicated teachers, under Redemptorist (C.Ss.R) leadership.
        </p>
        <blockquote className="mt-8 border-l-2 border-gold-400 pl-6 font-display text-lg italic text-gold-100">
          &ldquo;Committed to serve the community in the intellectual, moral, physical and social
          development of each child.&rdquo;
        </blockquote>
      </motion.div>
    </section>
  )
}

const STEPS = [
  { n: '01', icon: Search, title: 'Find your child', body: "Open the Parent Portal — your children and this term's fees are already waiting, broken down item by item." },
  { n: '02', icon: CreditCard, title: 'Pay securely', body: 'Pay the full balance or in part, by card, bank transfer or USSD — processed securely through Paystack.' },
  { n: '03', icon: FileCheck2, title: 'Get your receipt instantly', body: 'An official receipt is issued in seconds and emailed to you. The bursary sees your payment in real time.' },
]

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-14 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Simple &amp; Secure</div>
        <h2 className="mt-3 text-4xl text-white">How It Works</h2>
        <p className="mt-4 leading-relaxed text-navy-100">Three steps for parents to settle a term&rsquo;s fees, start to finish.</p>
      </motion.div>
      <div className="grid gap-7 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="glass p-9"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-gold-300">{s.n}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/30">
                <s.icon size={20} className="text-gold-300" />
              </div>
            </div>
            <h3 className="mt-5 font-sans text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-100">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* Leadership — drop in real names & photos from the College staff page. */
const TEAM = [
  { name: 'Rev. Fr. (Dr) Godfrey Udeh', role: 'Administrator · C.Ss.R' },
  { name: 'Ezinne (Mrs) Etoh Lawrencia', role: 'Principal · College' },
  { name: 'Mrs Ifeoma Okekearu', role: 'Head Mistress · Nur/Pry' },
  { name: 'Mrs Ehiemere Florence', role: 'Vice Head Mistress' },
  { name: 'The Chaplain', role: 'Spiritual Director' },
  { name: 'The Bursar', role: 'Finance & Fees' },
]

function Team() {
  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-14 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">The People</div>
        <h2 className="mt-3 text-4xl text-white">Meet the Team</h2>
        <p className="mt-4 leading-relaxed text-navy-100">
          The leadership guiding Archangels&rsquo; Schools in faith, character and academic excellence.
        </p>
      </motion.div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {TEAM.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: (i % 6) * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass flex flex-col items-center p-5 text-center"
          >
            <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-gold-400/40 sm:h-24 sm:w-24">
              <TeamAvatar index={i} />
            </div>
            <div className="mt-4 text-sm font-semibold text-white">{m.name}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-gold-300">{m.role}</div>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-navy-100/70">
        Portraits coming soon — send me the staff photos and I&rsquo;ll slot them in.
      </p>
    </section>
  )
}

const FEATURED_UNIFORMS: { kind: ArtKind; name: string; price: string; note: string }[] = [
  { kind: 'boys', name: "Boys' Uniform Set", price: '₦18,500', note: 'Check shirt + navy shorts/trousers' },
  { kind: 'girls', name: "Girls' Pinafore Set", price: '₦19,500', note: 'Pinafore + check blouse' },
  { kind: 'sports', name: 'Sports Wear', price: '₦12,000', note: 'House-colour tracksuit set' },
]

function UniformSpotlight() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-12 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Uniform Shop</div>
        <h2 className="mt-3 text-4xl text-white">Dress them for excellence</h2>
        <p className="mt-4 leading-relaxed text-navy-100">
          Order official {SCHOOL.name} uniforms online — pick a size, pay securely with Paystack,
          collect at the school office.
        </p>
      </motion.div>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
        {FEATURED_UNIFORMS.map((u, i) => (
          <motion.div
            key={u.kind}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
            whileHover={{ y: -8 }}
          >
            <Link to="/parent/uniforms" className="group block overflow-hidden rounded-2xl bg-paper-0 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="relative h-44 overflow-hidden border-b border-ink-100">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <UniformArt kind={u.kind} />
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-navy-950/85 px-3 py-1 font-mono text-xs text-gold-300 backdrop-blur">
                  {u.price}
                </span>
              </div>
              <div className="p-5">
                <div className="font-semibold text-navy-950">{u.name}</div>
                <div className="mt-0.5 text-xs text-ink-400">{u.note}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <motion.div {...inViewRise} className="mt-12 flex justify-center">
        <Link to="/parent/uniforms" className="btn-accent">
          <Shirt size={17} /> Shop All Uniforms
        </Link>
      </motion.div>
    </section>
  )
}

const BENTO_SPANS = [
  'sm:col-span-3 sm:row-span-2', 'sm:col-span-3 sm:row-span-2',
  'sm:col-span-2 sm:row-span-2', 'sm:col-span-2 sm:row-span-2',
  'sm:col-span-2 sm:row-span-2', 'sm:col-span-2 sm:row-span-2',
  'sm:col-span-2 sm:row-span-2', 'sm:col-span-2 sm:row-span-2',
]

function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-12 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Our Campus</div>
        <h2 className="mt-3 text-4xl text-white">Life at Archangels&rsquo;</h2>
        <p className="mt-4 leading-relaxed text-navy-100">A tour of the facilities your fees help sustain.</p>
      </motion.div>
      <div className="grid auto-rows-[130px] grid-cols-1 gap-3 sm:grid-cols-6">
        {SCHOOL.campusPhotos.map((p, i) => (
          <motion.figure
            key={p.caption}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            className={`group relative row-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card ${BENTO_SPANS[i % BENTO_SPANS.length]}`}
          >
            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:saturate-[1.1]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-navy-950/85 to-transparent p-4 text-sm font-medium tracking-wide text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {p.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="relative my-6 overflow-hidden px-8 py-32 text-center">
      <div
        className="absolute inset-0 bg-cover bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,24,48,0.82), rgba(10,24,48,0.95)), url('${SCHOOL.ctaPhoto}')`,
          backgroundPosition: 'center 30%',
        }}
      />
      <WaveDivider position="top" />
      <WaveDivider position="bottom" />
      <HolyLight intensity={0.5} />
      <motion.div {...inViewRise} className="relative z-20 mx-auto max-w-xl text-white">
        <h2 className="text-4xl text-white sm:text-5xl">Ready to settle this term&rsquo;s fees?</h2>
        <p className="mt-5 leading-relaxed text-navy-100">
          Open the Parent Portal to view your balance and pay in minutes — official receipt included.
        </p>
        <div className="mt-9 flex justify-center">
          <Link to="/parent" className="btn-accent animate-glow-pulse">
            <CreditCard size={17} /> Pay School Fees Now
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 px-8 pb-8 pt-16 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-12 border-b border-white/15 pb-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Crest className="h-9 w-9" />
            <div>
              <div className="font-display text-white">{SCHOOL.name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">{SCHOOL.motto}</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            A private Nursery, Primary &amp; College institution in Satellite Town, Lagos.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">Contact</h4>
          <div className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 flex-shrink-0" /><span>{SCHOOL.address}</span></div>
          <div className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 flex-shrink-0" /><a href={`mailto:${SCHOOL.email}`} className="hover:text-gold-300">{SCHOOL.email}</a></div>
          <div className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 flex-shrink-0" /><span>College {SCHOOL.phonePrimary}</span></div>
          <div className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 flex-shrink-0" /><span>Primary {SCHOOL.phoneSecondary}</span></div>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <div><Link to="/admissions" className="hover:text-gold-300">Apply for Admission</Link></div>
          <div><Link to="/parent" className="hover:text-gold-300">Pay School Fees</Link></div>
          <div><Link to="/parent/uniforms" className="hover:text-gold-300">School Store</Link></div>
          <div><a href="#ai" className="hover:text-gold-300">Ask Nalto AI</a></div>
          <div><Link to="/bursar" className="hover:text-gold-300">Bursar Login</Link></div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between pt-6 text-xs text-white/50">
        <span>© {new Date().getFullYear()} {SCHOOL.name}. All Rights Reserved.</span>
        <PoweredByNalto />
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <PageTransition>
      <AngelTouch>
        <PageCanvas />
        <Navbar />
        <HeavenHero />
        <StatsBar />
        <About />
        <Programs />
        <HowItWorks />
        <Activities />
        <AISection />
        <Team />
        <UniformSpotlight />
        <StoreStrip />
        <Gallery />
        <Directions />
        <CtaBanner />
        <ScriptureCenterSmall startIndex={3} />
        <Footer />
        <WhatsAppFab />
        <NaltoAI />
      </AngelTouch>
    </PageTransition>
  )
}

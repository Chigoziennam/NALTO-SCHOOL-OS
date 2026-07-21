import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Backpack, BookOpen, Church, Database, Dumbbell, FlaskConical,
  Globe2, GraduationCap, MapPin, MessageSquare, Music, Navigation, Shirt, Sparkles,
  Trophy, Users,
} from 'lucide-react'
import {
  SCHOOL, PROGRAMS, ACTIVITIES, AI_KNOWLEDGE, STORE_CATEGORIES,
} from '../lib/school'
import { inViewRise } from './PageTransition'
import { NaltoLogo } from './NaltoLogo'

const ACTIVITY_ICONS = {
  Trophy, Music, FlaskConical, BookOpen, Church, Palette: Sparkles, Globe2, Users,
} as const

const STORE_ICONS = { Shirt, BookOpen, Backpack, Dumbbell } as const

/* ---------------- Programs & Curriculum ---------------- */
export function Programs() {
  return (
    <section id="programs" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-14 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Academics</div>
        <h2 className="mt-3 text-4xl text-white">Programs &amp; Curriculum</h2>
        <p className="mt-4 leading-relaxed text-navy-100">
          One school, three sections — a seamless journey from early years to graduation.
        </p>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-3">
        {PROGRAMS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -8 }}
            className="glass flex flex-col p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 ring-1 ring-gold-400/30">
                <GraduationCap size={22} className="text-gold-300" />
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200 ring-1 ring-white/10">
                {p.ages}
              </span>
            </div>
            <h3 className="mt-6 font-display text-2xl text-white">{p.name}</h3>
            <div className="mt-1 text-sm font-medium text-gold-300">{p.tagline}</div>
            <p className="mt-4 text-sm leading-relaxed text-navy-100">{p.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.subjects.slice(0, 6).map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-navy-100">
                  {s}
                </span>
              ))}
              {p.subjects.length > 6 && (
                <span className="rounded-full px-3 py-1 text-xs text-gold-300">+{p.subjects.length - 6} more</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div {...inViewRise} className="mt-12 flex justify-center">
        <Link to="/admissions" className="btn-accent">
          <GraduationCap size={17} /> Apply for Admission
        </Link>
      </motion.div>
    </section>
  )
}

/* ---------------- School Life / Activities ---------------- */
export function Activities() {
  return (
    <section id="activities" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-14 max-w-xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Beyond the Classroom</div>
        <h2 className="mt-3 text-4xl text-white">School Life &amp; Activities</h2>
        <p className="mt-4 leading-relaxed text-navy-100">
          We grow the whole child — mind, body and spirit — through a rich co-curricular life.
        </p>
      </motion.div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((a, i) => {
          const Icon = ACTIVITY_ICONS[a.icon]
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass flex items-start gap-4 p-6"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-400/30">
                <Icon size={20} className="text-gold-300" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-100">{a.body}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Nalto AI workflow section ---------------- */
export function AISection() {
  const feed = AI_KNOWLEDGE.slice(0, 5)
  const demoQA = AI_KNOWLEDGE.slice(0, 3)
  return (
    <section id="ai" className="relative mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inViewRise} className="mx-auto mb-14 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
          <Sparkles size={13} /> Powered by Nalto AI
        </div>
        <h2 className="mt-5 text-4xl text-white">A school assistant that never sleeps</h2>
        <p className="mt-4 leading-relaxed text-navy-100">
          We feed the AI a little about {SCHOOL.name} — fees, dates, uniforms, admissions — and it
          answers parents’ common questions instantly, so your staff don’t have to repeat themselves.
        </p>
      </motion.div>

      {/* Workflow: data -> AI -> answers */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {/* 1. School data fed in */}
        <motion.div {...inViewRise} className="glass p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Database size={16} className="text-gold-300" /> 1 · School data
          </div>
          <p className="mt-2 text-xs text-navy-100">The facts we teach the assistant (mock data for this demo).</p>
          <div className="mt-4 space-y-2">
            {feed.map((k) => (
              <div key={k.id} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-navy-100">
                <span className="font-semibold text-gold-200">{k.topic}:</span> {k.question}
              </div>
            ))}
          </div>
        </motion.div>

        <FlowArrow />

        {/* 2. AI brain */}
        <motion.div {...inViewRise} className="glass-strong flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 ring-1 ring-gold-400/40 shadow-gold-glow"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <NaltoLogo className="h-14 w-14" />
          </motion.div>
          <div className="mt-4 text-sm font-semibold text-white">2 · Nalto AI</div>
          <p className="mt-1 text-xs text-navy-100">Understands the question, finds the right answer.</p>
        </motion.div>

        <FlowArrow />

        {/* 3. Parent answers */}
        <motion.div {...inViewRise} className="glass p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MessageSquare size={16} className="text-gold-300" /> 3 · Instant answers
          </div>
          <p className="mt-2 text-xs text-navy-100">Parents ask in plain English, day or night.</p>
          <div className="mt-4 space-y-3">
            {demoQA.map((k) => (
              <div key={k.id} className="space-y-1.5">
                <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-gold-500 px-3 py-1.5 text-xs text-navy-950">
                  {k.question}
                </div>
                <div className="w-fit max-w-[95%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-navy-100">
                  {k.answer.length > 90 ? k.answer.slice(0, 90) + '…' : k.answer}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div {...inViewRise} className="mt-12 flex justify-center">
        <button
          onClick={() => window.dispatchEvent(new Event('nalto:open'))}
          className="btn-accent"
        >
          <Sparkles size={17} /> Try Nalto AI now
        </button>
      </motion.div>
    </section>
  )
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="text-gold-400/70"
      >
        <ArrowRight size={26} />
      </motion.div>
    </div>
  )
}

/* ---------------- School store strip (categories) ---------------- */
export function StoreStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STORE_CATEGORIES.map((c, i) => {
          const Icon = STORE_ICONS[c.icon]
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to="/parent/uniforms" className="glass flex items-center gap-3 p-5 transition-colors hover:bg-white/[0.1]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-400/30">
                  <Icon size={20} className="text-gold-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{c.name}</div>
                  <div className="text-xs text-navy-100">{c.note}</div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Directions / map ---------------- */
export function Directions() {
  return (
    <section id="directions" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div {...inViewRise}>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Visit Us</div>
          <h2 className="mt-3 text-4xl text-white">Find your way to {SCHOOL.name}</h2>
          <p className="mt-4 leading-relaxed text-navy-100">
            We’re in the heart of Satellite Town, Lagos. Come see the campus, meet the team and feel
            the community your child will grow in.
          </p>
          <div className="mt-6 flex items-start gap-3 text-navy-100">
            <MapPin size={18} className="mt-0.5 flex-shrink-0 text-gold-300" />
            <span>{SCHOOL.address}</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={SCHOOL.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-accent">
              <Navigation size={17} /> Get Directions
            </a>
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageSquare size={17} /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
        >
          <iframe
            title="School location map"
            src={SCHOOL.mapEmbedSrc}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}

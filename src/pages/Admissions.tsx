import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, FileCheck2, GraduationCap, Home, Paperclip,
  Sparkles, Upload, UserRound,
} from 'lucide-react'
import { SCHOOL, ADMISSION_STEPS, ADMISSION_REQUIREMENTS, CLASS_APPLYING } from '../lib/school'
import { Crest, PoweredByNalto } from '../components/Brand'
import { DashboardBackdrop } from '../components/DashboardBackdrop'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { AngelTouch } from '../components/AngelTouch'

function Field({
  label, children, full = false,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-ink-200 bg-paper-0 px-4 py-2.5 text-sm text-navy-950 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition'

function FileField({ label }: { label: string }) {
  const [name, setName] = useState<string | null>(null)
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink-300 bg-paper-50 px-4 py-3 text-sm transition hover:border-gold-500 hover:bg-paper-100">
      <Upload size={18} className="flex-shrink-0 text-gold-500" />
      <div className="min-w-0">
        <div className="font-medium text-navy-950">{label}</div>
        <div className="truncate text-xs text-ink-400">{name ?? 'Tap to upload (optional)'}</div>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  )
}

export default function Admissions() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Demo: generate a reference. In production this POSTs to Supabase / n8n.
    setSubmitted('ADM-' + Math.random().toString(36).slice(2, 8).toUpperCase())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PageTransition>
      <AngelTouch>
        <DashboardBackdrop variant="parent" />
        <div className="relative z-10 min-h-screen pb-24">
          {/* Header */}
          <div className="border-b border-white/10 bg-navy-950">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-navy-100 transition-colors hover:text-gold-300">
                <ArrowLeft size={16} /> Back to Home
              </Link>
              <div className="flex items-center gap-2.5">
                <Crest className="h-8 w-8" />
                <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="border-b border-ink-200 bg-navy-950 pb-14 pt-8 text-center text-white">
            <motion.div {...inViewRise} className="mx-auto max-w-2xl px-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 ring-1 ring-gold-400/30">
                <GraduationCap size={26} className="text-gold-300" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Admissions {SCHOOL.currentSession}</div>
              <h1 className="mt-3 text-4xl text-white sm:text-5xl">Apply Online</h1>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-navy-100">
                Begin your child’s admission from home. Fill the form below and our staff receive your
                application digitally — no paper, no queue.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto max-w-5xl px-6">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card mx-auto mt-12 max-w-lg p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-status-paid-soft"
                  >
                    <CheckCircle2 size={44} className="text-status-paid-deep" />
                  </motion.div>
                  <h2 className="mt-6 text-3xl">Application Received</h2>
                  <p className="mt-3 leading-relaxed text-ink-500">
                    Thank you! Your application has been submitted to the admissions office. We’ll email
                    you within 48 hours to schedule the entrance assessment.
                  </p>
                  <div className="mt-6 rounded-xl bg-paper-50 px-5 py-4">
                    <div className="kpi-label">Application Reference</div>
                    <div className="mt-1 font-mono text-xl font-semibold text-navy-950">{submitted}</div>
                  </div>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/" className="btn-secondary"><Home size={16} /> Back to Home</Link>
                    <button onClick={() => setSubmitted(null)} className="btn-primary">
                      <FileCheck2 size={16} /> Submit Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Steps */}
                  <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {ADMISSION_STEPS.map((s, i) => (
                      <motion.div
                        key={s.n}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="card"
                      >
                        <div className="font-mono text-sm font-semibold text-gold-500">{s.n}</div>
                        <h3 className="mt-2 text-base font-semibold text-navy-950">{s.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.body}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Form */}
                    <form onSubmit={onSubmit} className="card space-y-8 p-7">
                      {/* Student */}
                      <fieldset>
                        <legend className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-950">
                          <UserRound size={18} className="text-gold-500" /> Student Information
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="First Name"><input required className={inputCls} placeholder="Chigozie" /></Field>
                          <Field label="Surname"><input required className={inputCls} placeholder="Nnam" /></Field>
                          <Field label="Date of Birth"><input required type="date" className={inputCls} /></Field>
                          <Field label="Gender">
                            <select required className={inputCls} defaultValue="">
                              <option value="" disabled>Select…</option>
                              <option>Male</option><option>Female</option>
                            </select>
                          </Field>
                          <Field label="Class Applying For" full>
                            <select required className={inputCls} defaultValue="">
                              <option value="" disabled>Select a class…</option>
                              {CLASS_APPLYING.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </Field>
                          <Field label="Previous School (if any)" full>
                            <input className={inputCls} placeholder="Name of last school attended" />
                          </Field>
                        </div>
                      </fieldset>

                      {/* Guardian */}
                      <fieldset className="border-t border-ink-100 pt-6">
                        <legend className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-950">
                          <Home size={18} className="text-gold-500" /> Parent / Guardian
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Full Name"><input required className={inputCls} placeholder="Mr / Mrs …" /></Field>
                          <Field label="Relationship">
                            <select required className={inputCls} defaultValue="">
                              <option value="" disabled>Select…</option>
                              <option>Father</option><option>Mother</option><option>Guardian</option>
                            </select>
                          </Field>
                          <Field label="Phone Number"><input required type="tel" className={inputCls} placeholder="+234 …" /></Field>
                          <Field label="Email Address"><input required type="email" className={inputCls} placeholder="you@email.com" /></Field>
                          <Field label="Home Address" full>
                            <input required className={inputCls} placeholder="Street, area, city" />
                          </Field>
                        </div>
                      </fieldset>

                      {/* Documents */}
                      <fieldset className="border-t border-ink-100 pt-6">
                        <legend className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-950">
                          <Paperclip size={18} className="text-gold-500" /> Documents
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <FileField label="Birth Certificate" />
                          <FileField label="Passport Photograph" />
                          <FileField label="Last Report Card" />
                          <FileField label="Immunisation Record" />
                        </div>
                      </fieldset>

                      <button type="submit" className="btn-accent w-full">
                        <FileCheck2 size={17} /> Submit Application
                      </button>
                      <p className="text-center text-xs text-ink-400">
                        By submitting you agree to be contacted about your child’s admission.
                      </p>
                    </form>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                      <div className="card">
                        <h3 className="text-base font-semibold text-navy-950">What you’ll need</h3>
                        <ul className="mt-4 space-y-3">
                          {ADMISSION_REQUIREMENTS.map((r) => (
                            <li key={r} className="flex items-start gap-2.5 text-sm text-ink-500">
                              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-status-paid" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-navy-900 to-navy-950 p-6 text-white">
                        <Sparkles size={20} className="text-gold-300" />
                        <h3 className="mt-3 text-base font-semibold text-white">Have a question?</h3>
                        <p className="mt-2 text-sm leading-relaxed text-navy-100">
                          Ask <strong className="text-gold-200">Nalto AI</strong> (bottom-left) about fees,
                          requirements or resumption dates — any time, instantly.
                        </p>
                      </div>
                    </aside>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-auto mt-16 flex max-w-5xl items-center justify-between px-6 text-xs text-ink-400">
            <span>© {new Date().getFullYear()} {SCHOOL.name}</span>
            <PoweredByNalto dark />
          </div>
        </div>
      </AngelTouch>
    </PageTransition>
  )
}

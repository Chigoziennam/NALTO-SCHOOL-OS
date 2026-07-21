import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { AI_KNOWLEDGE, SCHOOL, type KnowledgeEntry } from '../lib/school'
import { NaltoLogo } from './NaltoLogo'

interface Msg {
  id: number
  from: 'ai' | 'user'
  text: string
}

/** Route a free-text question to the best-matching knowledge entry. */
function match(q: string): KnowledgeEntry | null {
  const text = q.toLowerCase()
  let best: { entry: KnowledgeEntry; score: number } | null = null
  for (const entry of AI_KNOWLEDGE) {
    let score = 0
    for (const kw of entry.keywords) if (text.includes(kw)) score += kw.split(' ').length
    if (score > 0 && (!best || score > best.score)) best = { entry, score }
  }
  return best?.entry ?? null
}

const FALLBACK =
  `I’m not certain about that one yet — but I’m learning! You can reach the school office directly on ${SCHOOL.phonePrimary} or tap the WhatsApp button and a person will help you.`

const SUGGESTIONS = [
  'When does school reopen?',
  'How much is tuition?',
  'How do I apply for admission?',
  'What uniform does my child need?',
  'When is the next PTA meeting?',
]

let msgId = 0

export function NaltoAI() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: msgId++, from: 'ai', text: `Hi! I’m Nalto AI, the ${SCHOOL.name} assistant. Ask me about fees, admissions, uniforms, resumption dates and more.` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  // Let any "Ask Nalto AI" button on the page pop the assistant open.
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('nalto:open', onOpen)
    return () => window.removeEventListener('nalto:open', onOpen)
  }, [])

  function localReply(q: string) {
    const entry = match(q)
    return entry ? entry.answer : FALLBACK
  }

  async function ask(question: string) {
    const q = question.trim()
    if (!q || typing) return
    const history = msgs
      .filter((m) => m.id !== 0)
      .map((m) => ({ role: m.from === 'ai' ? 'assistant' : 'user', content: m.text }))
    setMsgs((m) => [...m, { id: msgId++, from: 'user', text: q }])
    setInput('')
    setTyping(true)

    const webhook = import.meta.env.VITE_N8N_AI_WEBHOOK as string | undefined
    let reply = ''
    if (webhook) {
      // Live: hand the question to the n8n workflow (OpenRouter-backed).
      try {
        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q, history }),
        })
        const data = await res.json()
        const candidate = (data?.reply ?? '').toString().trim()
        // Only trust it when the workflow actually got a completion. If the
        // OpenRouter step isn't wired yet, fall back to the built-in answers.
        if (data?.ok !== false && candidate && !/couldn.?t reach the assistant/i.test(candidate)) {
          reply = candidate
        }
      } catch {
        /* falls through to the built-in knowledge base */
      }
    }
    if (!reply) {
      // Offline / demo fallback keeps the chat working with zero setup.
      reply = localReply(q)
      await new Promise((r) => window.setTimeout(r, 500 + Math.min(reply.length * 3, 600)))
    }
    setTyping(false)
    setMsgs((m) => [...m, { id: msgId++, from: 'ai', text: reply }])
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="no-print fixed bottom-5 left-5 z-[70] flex items-center gap-2.5 rounded-full bg-gradient-to-br from-navy-900 to-navy-950 py-2.5 pl-2.5 pr-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,24,48,0.5)] ring-1 ring-gold-400/40"
        whileHover={{ y: -3, boxShadow: '0 14px 40px rgba(201,154,62,0.4)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Nalto AI assistant"
      >
        {open ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><X size={18} /></span>
        ) : (
          <motion.span
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/40"
            animate={{ boxShadow: ['0 0 0 0 rgba(230,199,128,0.4)', '0 0 0 6px rgba(230,199,128,0)'] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <NaltoLogo className="h-8 w-8" />
          </motion.span>
        )}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask Nalto AI'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="no-print fixed bottom-24 left-5 z-[70] flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-navy-950/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-navy-900 to-navy-950 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/15 ring-1 ring-gold-400/40">
                <NaltoLogo className="h-9 w-9" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">Nalto AI</div>
                <div className="flex items-center gap-1.5 text-[11px] text-navy-100">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-paid opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-status-paid" />
                  </span>
                  Online · {SCHOOL.name} assistant
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-gold-500 text-navy-950'
                        : 'rounded-bl-sm border border-white/10 bg-white/[0.06] text-navy-100'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-gold-300"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion chips (only before the first user turn) */}
              {msgs.length === 1 && !typing && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-300/80">Popular questions</div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="rounded-full border border-gold-400/50 bg-gradient-to-br from-gold-400/25 to-gold-500/15 px-3.5 py-2 text-left text-xs font-medium text-gold-100 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:from-gold-400/40 hover:to-gold-500/25"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); ask(input) }}
              className="flex items-center gap-2 border-t border-gold-400/20 bg-white/[0.06] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="min-w-0 flex-1 rounded-full border border-gold-400/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-200 focus:border-gold-300 focus:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-gold-400/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 text-navy-950 shadow-gold-glow transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react'
import { SCHOOL } from '../lib/school'
import { formatKobo } from '../lib/format'
import { DEMO_GUARDIAN } from '../lib/demoData'
import { Crest, DemoModePill, PoweredByNalto } from '../components/Brand'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { AngelTouch } from '../components/AngelTouch'
import { usePaystack } from '../components/usePaystack'
import { UniformArt, type ArtKind } from '../components/UniformArt'

const SIZES = ['Age 3–5', 'Age 6–8', 'Age 9–11', 'Age 12–14', 'Age 15+'] as const

interface UniformItem {
  id: string
  name: string
  priceKobo: number
  kind: ArtKind
  note: string
}

const ITEMS: UniformItem[] = [
  { id: 'uni-boys', name: "Boys' Uniform Set", priceKobo: 18_500 * 100, kind: 'boys', note: 'Check shirt + navy shorts/trousers' },
  { id: 'uni-girls', name: "Girls' Pinafore Set", priceKobo: 19_500 * 100, kind: 'girls', note: 'Pinafore + check blouse' },
  { id: 'uni-sports', name: 'Sports Wear', priceKobo: 12_000 * 100, kind: 'sports', note: 'House-colour tracksuit set' },
  { id: 'uni-cardigan', name: 'School Cardigan', priceKobo: 9_500 * 100, kind: 'cardigan', note: 'Navy with gold trim' },
  { id: 'uni-tie', name: 'School Tie & Beret', priceKobo: 4_500 * 100, kind: 'tie', note: 'Crested — college section' },
  { id: 'uni-socks', name: 'Socks (3 pairs)', priceKobo: 3_000 * 100, kind: 'socks', note: 'White with navy band' },
]

function UniformCard({ item, index }: { item: UniformItem; index: number }) {
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const { pay, overlay } = usePaystack()

  const total = item.priceKobo * qty

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.1 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden p-0"
    >
      {overlay}
      <div className="relative h-44 overflow-hidden border-b border-ink-100">
        <UniformArt kind={item.kind} />
        <span className="absolute right-3 top-3 rounded-full bg-navy-950/85 px-3 py-1 font-mono text-xs text-gold-300 backdrop-blur">
          {formatKobo(item.priceKobo)}
        </span>
      </div>
      <div className="p-5">
        <div className="font-semibold text-navy-950">{item.name}</div>
        <div className="mt-0.5 text-xs text-ink-400">{item.note}</div>

        <div className="mt-4">
          <div className="kpi-label mb-2">Select size</div>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  size === s
                    ? 'border-gold-500 bg-gold-500 text-navy-950 shadow-gold-glow'
                    : 'border-ink-200 bg-paper-0 text-ink-500 hover:border-gold-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-ink-200 px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1 text-ink-400 hover:text-navy-950" aria-label="Decrease quantity"><Minus size={14} /></button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(9, q + 1))} className="p-1 text-ink-400 hover:text-navy-950" aria-label="Increase quantity"><Plus size={14} /></button>
          </div>
          <button
            disabled={!size}
            onClick={() =>
              pay({
                amountKobo: total,
                email: DEMO_GUARDIAN.email,
                studentId: 'uniform-order',
                invoiceId: `uniform-${item.id}-${size}-x${qty}`,
                guardianId: DEMO_GUARDIAN.id,
                studentName: `${item.name} (${size}) × ${qty}`,
              })
            }
            className="btn-accent flex-1 px-4 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={14} /> {size ? `Pay ${formatKobo(total)}` : 'Pick a size'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function UniformShop() {
  return (
    <PageTransition>
      <AngelTouch>
        <DemoModePill />
        <div className="min-h-screen bg-paper-50 pb-20">
          <div className="border-b border-ink-200 bg-navy-950">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
              <Link to="/parent" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
                <ArrowLeft size={16} /> Back to dashboard
              </Link>
              <div className="flex items-center gap-2.5">
                <Crest className="h-8 w-8" />
                <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pb-8 pt-10"
            >
              <h1 className="text-3xl sm:text-4xl">Uniform Shop</h1>
              <p className="mt-2 max-w-xl text-ink-500">
                Order official {SCHOOL.name} uniforms — pick a size, pay securely with Paystack,
                and collect from the school office. Sample images shown; product photos coming soon.
              </p>
            </motion.div>

            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ITEMS.map((item, i) => <UniformCard key={item.id} item={item} index={i} />)}
            </section>

            <motion.p {...inViewRise} className="mt-8 text-center text-xs text-ink-400">
              Sizes run true to age. Exchanges within 7 days with receipt · {SCHOOL.phonePrimary}
            </motion.p>

            <div className="mt-14 text-center"><PoweredByNalto dark /></div>
          </main>
        </div>
      </AngelTouch>
    </PageTransition>
  )
}

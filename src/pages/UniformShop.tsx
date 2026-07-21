import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import { SCHOOL, STORE_ITEMS, type StoreItem } from '../lib/school'
import { formatNaira } from '../lib/format'
import { useCart } from '../lib/cart'
import { Crest, PoweredByNalto } from '../components/Brand'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { AngelTouch } from '../components/AngelTouch'
import { UniformArt, type ArtKind } from '../components/UniformArt'

const SIZES = ['Age 3–5', 'Age 6–8', 'Age 9–11', 'Age 12–14', 'Age 15+'] as const

function ProductImage({ item }: { item: StoreItem }) {
  const [failed, setFailed] = useState(false)
  if (item.photo && !failed) {
    return (
      <img
        src={item.photo}
        alt={item.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    )
  }
  return <div className="h-full w-full transition-transform duration-500 group-hover:scale-105"><UniformArt kind={item.kind as ArtKind} /></div>
}

function ProductCard({ item, index }: { item: StoreItem; index: number }) {
  const { addItem } = useCart()
  const [size, setSize] = useState<string>(SIZES[1])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function add() {
    addItem(item, size, qty)
    setAdded(true)
    setQty(1)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden p-0"
    >
      <div className="relative h-48 overflow-hidden border-b border-ink-100 bg-paper-50">
        <ProductImage item={item} />
        <span className="absolute right-3 top-3 rounded-full bg-navy-950/85 px-3 py-1 font-mono text-xs text-gold-300 backdrop-blur">
          {formatNaira(item.priceNaira)}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900 backdrop-blur">
          Official
        </span>
      </div>
      <div className="p-5">
        <div className="font-semibold text-navy-950">{item.name}</div>
        <div className="mt-0.5 text-xs text-ink-400">{item.note}</div>

        <div className="mt-4">
          <div className="kpi-label mb-2">Size</div>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  size === s ? 'border-gold-500 bg-gold-500 text-navy-950 shadow-gold-glow' : 'border-ink-200 bg-paper-0 text-ink-500 hover:border-gold-400'
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
            onClick={add}
            className={`flex-1 justify-center rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              added ? 'bg-status-paid text-white' : 'btn-accent'
            }`}
          >
            {added ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to cart</>}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function UniformShop() {
  const { itemCount, itemsTotal } = useCart()
  return (
    <PageTransition>
      <AngelTouch>
        <div className="min-h-screen bg-paper-50 pb-28">
          <div className="border-b border-ink-200 bg-navy-950">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
              <Link to="/parent" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
                <ArrowLeft size={16} /> Back to checkout
              </Link>
              <div className="flex items-center gap-2.5">
                <Crest className="h-8 w-8" />
                <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="pb-8 pt-10">
              <h1 className="text-3xl sm:text-4xl">School Store</h1>
              <p className="mt-2 max-w-xl text-ink-500">
                Order official {SCHOOL.name} uniforms, books and kit — add to your cart, then pay together
                with your school fees. Collect at the school office.
              </p>
            </motion.div>

            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {STORE_ITEMS.map((item, i) => <ProductCard key={item.id} item={item} index={i} />)}
            </section>

            <motion.p {...inViewRise} className="mt-8 text-center text-xs text-ink-400">
              Sizes run true to age. Exchanges within 7 days with receipt · {SCHOOL.phonePrimary}
            </motion.p>

            <div className="mt-12 text-center"><PoweredByNalto dark /></div>
          </main>
        </div>

        {/* Sticky cart bar */}
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-gold-400/20 bg-navy-950/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
            <div className="text-sm text-navy-100">
              <span className="font-semibold text-white">{itemCount}</span> item{itemCount === 1 ? '' : 's'} in cart
              {itemsTotal > 0 && <span className="ml-2 font-mono text-gold-300">{formatNaira(itemsTotal)}</span>}
            </div>
            <Link to="/parent" className="btn-accent px-6 py-3 text-sm">
              <ShoppingBag size={16} /> Go to checkout
            </Link>
          </div>
        </div>
      </AngelTouch>
    </PageTransition>
  )
}

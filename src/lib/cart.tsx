import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { feeForClass, type StoreItem } from './school'

/**
 * One shared basket for the whole app: school fees for one or more students
 * (each with a part-payment %) plus uniform/store items. Persisted to
 * localStorage so it survives navigation between the shop and checkout.
 */

export type PayPct = 25 | 50 | 75 | 100

export interface FeeLine {
  id: string
  student: string
  className: string
  term: string
  /** how much of the term fee to pay now */
  pct: PayPct
}

export interface ItemLine {
  id: string
  itemId: string
  name: string
  size: string
  qty: number
  priceNaira: number
}

interface CartValue {
  fees: FeeLine[]
  items: ItemLine[]
  addFee: (defaults?: Partial<FeeLine>) => void
  updateFee: (id: string, patch: Partial<FeeLine>) => void
  removeFee: (id: string) => void
  addItem: (item: StoreItem, size: string, qty?: number) => void
  updateItem: (id: string, patch: Partial<ItemLine>) => void
  removeItem: (id: string) => void
  clear: () => void
  feesTotal: number
  itemsTotal: number
  total: number
  itemCount: number
}

/** Amount actually being paid now for a fee line (fee × pct). */
export function feeLineAmount(f: FeeLine): number {
  return Math.round((feeForClass(f.className) * f.pct) / 100)
}

const KEY = 'nalto-cart-v1'
const uid = () => Math.random().toString(36).slice(2, 9)

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [fees, setFees] = useState<FeeLine[]>(() => load().fees)
  const [items, setItems] = useState<ItemLine[]>(() => load().items)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ fees, items })) } catch { /* ignore */ }
  }, [fees, items])

  const value = useMemo<CartValue>(() => {
    const feesTotal = fees.reduce((s, f) => s + feeLineAmount(f), 0)
    const itemsTotal = items.reduce((s, i) => s + i.priceNaira * i.qty, 0)
    return {
      fees,
      items,
      addFee: (d) => setFees((fs) => [...fs, { id: uid(), student: '', className: '', term: 'First Term', pct: 100, ...d }]),
      updateFee: (id, patch) => setFees((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f))),
      removeFee: (id) => setFees((fs) => fs.filter((f) => f.id !== id)),
      addItem: (item, size, qty = 1) =>
        setItems((its) => {
          const found = its.find((i) => i.itemId === item.id && i.size === size)
          if (found) return its.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i))
          return [...its, { id: uid(), itemId: item.id, name: item.name, size, qty, priceNaira: item.priceNaira }]
        }),
      updateItem: (id, patch) => setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i))),
      removeItem: (id) => setItems((its) => its.filter((i) => i.id !== id)),
      clear: () => { setFees([]); setItems([]) },
      feesTotal,
      itemsTotal,
      total: feesTotal + itemsTotal,
      itemCount: fees.length + items.reduce((s, i) => s + i.qty, 0),
    }
  }, [fees, items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function load(): { fees: FeeLine[]; items: ItemLine[] } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return { fees: Array.isArray(p.fees) ? p.fees : [], items: Array.isArray(p.items) ? p.items : [] }
    }
  } catch { /* ignore */ }
  return { fees: [], items: [] }
}

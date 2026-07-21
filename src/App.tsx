import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './lib/cart'
import Landing from './pages/Landing'

const ParentDashboard = lazy(() => import('./pages/ParentDashboard'))
const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'))
const BursarDashboard = lazy(() => import('./pages/BursarDashboard'))
const Report = lazy(() => import('./pages/Report'))
const UniformShop = lazy(() => import('./pages/UniformShop'))
const Admissions = lazy(() => import('./pages/Admissions'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-ink-200 border-t-gold-500" />
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1 } },
})

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/invoice/:invoiceId" element={<InvoiceDetail />} />
          <Route path="/parent/uniforms" element={<UniformShop />} />
          <Route path="/bursar" element={<BursarDashboard />} />
          <Route path="/bursar/report" element={<Report />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  )
}

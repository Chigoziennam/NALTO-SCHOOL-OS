/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_N8N_PAYMENT_WEBHOOK?: string
  readonly VITE_N8N_STUDENT_ADDED?: string
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

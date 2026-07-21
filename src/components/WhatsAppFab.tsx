import { motion } from 'framer-motion'
import { SCHOOL } from '../lib/school'

/** WhatsApp icon (brand glyph) — inline so no external asset is needed. */
function WhatsAppGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16.04 4C9.9 4 4.92 8.98 4.92 15.12c0 2.14.6 4.14 1.64 5.85L4.5 28l7.2-1.98a11.06 11.06 0 0 0 4.34.88h.01c6.14 0 11.12-4.98 11.12-11.12C27.17 8.98 22.19 4 16.04 4Zm0 20.3h-.01c-1.38 0-2.74-.37-3.92-1.07l-.28-.17-4.27 1.17 1.14-4.16-.18-.29a9.13 9.13 0 0 1-1.4-4.87c0-5.05 4.11-9.16 9.17-9.16 2.45 0 4.75.96 6.48 2.69a9.1 9.1 0 0 1 2.68 6.48c0 5.06-4.11 9.17-9.16 9.17Zm5.03-6.86c-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.16-.43-2.21-1.36-.82-.73-1.37-1.63-1.53-1.9-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.3s.99 2.66 1.12 2.85c.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32Z" />
    </svg>
  )
}

export function WhatsAppFab() {
  const href = `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(
    `Hello ${SCHOOL.name}, I have an enquiry.`,
  )}`
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print fixed bottom-[4.75rem] right-4 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <WhatsAppGlyph />
    </motion.a>
  )
}

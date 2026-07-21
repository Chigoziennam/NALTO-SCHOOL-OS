/** Money is stored in kobo (bigint). Divide by 100 only at display time. */
export function koboToNaira(kobo: number): number {
  return Math.round(kobo / 100)
}

export function formatNaira(naira: number): string {
  return '₦' + Math.round(naira).toLocaleString('en-NG')
}

export function formatKobo(kobo: number): string {
  return formatNaira(koboToNaira(kobo))
}

/** Compact form for KPI headlines: ₦11.1M, ₦840K */
export function formatKoboCompact(kobo: number): string {
  const n = kobo / 100
  if (n >= 1_000_000) return '₦' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return '₦' + Math.round(n / 1_000) + 'K'
  return formatNaira(n)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
}

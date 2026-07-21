import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import { SCHOOL } from '../lib/school'
import { formatKobo } from '../lib/format'
import { useClassSummary, useDashboardTotals, useOwingStudents } from '../hooks/useData'
import { Crest, PoweredByNalto } from '../components/Brand'
import { PageTransition } from '../components/PageTransition'

export default function Report() {
  const { data: totals } = useDashboardTotals()
  const { data: classes } = useClassSummary()
  const { data: owing } = useOwingStudents()
  const pageRef = useRef<HTMLDivElement>(null)

  const downloadPdf = () => {
    if (!pageRef.current) return
    html2pdf()
      .set({
        margin: 10,
        filename: `${SCHOOL.shortCode}-fee-collection-report-${SCHOOL.currentTerm.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] },
      })
      .from(pageRef.current)
      .save()
  }

  const th = 'border-b-2 border-navy-950 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider'
  const td = 'border-b border-ink-200 px-2 py-1.5'

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper-100 pb-16">
        {/* Toolbar (hidden in print) */}
        <div className="no-print border-b border-ink-200 bg-navy-950">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link to="/bursar" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="btn-ghost px-5 py-2.5 text-xs"><Printer size={15} /> Print</button>
              <button onClick={downloadPdf} className="btn-accent px-5 py-2.5 text-xs"><Download size={15} /> Download PDF</button>
            </div>
          </div>
        </div>

        {/* A4 sheet */}
        <div ref={pageRef} className="print-page mx-auto mt-8 max-w-[210mm] bg-white p-10 shadow-lg sm:p-14">
          <div className="text-center">
            <Crest className="mx-auto h-16 w-16" />
            <h1 className="mt-3 text-3xl">{SCHOOL.name}</h1>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-700">{SCHOOL.motto}</div>
            <div className="mt-4 font-sans text-lg font-semibold text-navy-950">
              Fee Collection Report — {SCHOOL.currentTerm} {SCHOOL.currentSession}
            </div>
            <div className="mt-1 text-xs text-ink-400">
              Generated {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Summary strip */}
          <div className="mt-8 grid grid-cols-4 gap-3 border-y-2 border-navy-950 py-4 text-center text-sm">
            {[
              ['Billed', totals && formatKobo(totals.total_billed_kobo)],
              ['Collected', totals && formatKobo(totals.total_collected_kobo)],
              ['Outstanding', totals && formatKobo(totals.total_outstanding_kobo)],
              ['Rate', totals && totals.collection_rate_pct + '%'],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
                <div className="mt-1 font-mono font-semibold text-navy-950">{value ?? '—'}</div>
              </div>
            ))}
          </div>

          {/* Class summary */}
          <h2 className="mt-8 font-sans text-base font-semibold text-navy-950">Class Summary</h2>
          <table className="mt-3 w-full text-xs">
            <thead>
              <tr>
                <th className={th}>Class</th>
                <th className={`${th} text-right`}>Students</th>
                <th className={`${th} text-right`}>Paid</th>
                <th className={`${th} text-right`}>Part</th>
                <th className={`${th} text-right`}>Owing</th>
                <th className={`${th} text-right`}>Billed</th>
                <th className={`${th} text-right`}>Collected</th>
                <th className={`${th} text-right`}>Outstanding</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {classes?.map((c) => (
                <tr key={c.class_name}>
                  <td className={`${td} font-sans font-medium`}>{c.class_name}</td>
                  <td className={`${td} text-right`}>{c.student_count}</td>
                  <td className={`${td} text-right`}>{c.paid_count}</td>
                  <td className={`${td} text-right`}>{c.part_paid_count}</td>
                  <td className={`${td} text-right`}>{c.owing_count}</td>
                  <td className={`${td} text-right`}>{formatKobo(c.total_billed_kobo)}</td>
                  <td className={`${td} text-right`}>{formatKobo(c.total_paid_kobo)}</td>
                  <td className={`${td} text-right`}>{formatKobo(c.total_outstanding_kobo)}</td>
                </tr>
              ))}
              {totals && (
                <tr className="font-semibold">
                  <td className="px-2 py-2 font-sans">TOTAL</td>
                  <td className="px-2 py-2 text-right">{totals.active_students}</td>
                  <td className="px-2 py-2 text-right">{totals.paid_students}</td>
                  <td className="px-2 py-2 text-right">{totals.part_paid_students}</td>
                  <td className="px-2 py-2 text-right">{totals.owing_students}</td>
                  <td className="px-2 py-2 text-right">{formatKobo(totals.total_billed_kobo)}</td>
                  <td className="px-2 py-2 text-right">{formatKobo(totals.total_collected_kobo)}</td>
                  <td className="px-2 py-2 text-right">{formatKobo(totals.total_outstanding_kobo)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Owing students */}
          <h2 className="mt-9 font-sans text-base font-semibold text-navy-950">Owing Students</h2>
          <table className="mt-3 w-full text-xs">
            <thead>
              <tr>
                <th className={th}>Student</th>
                <th className={th}>Class</th>
                <th className={`${th} text-right`}>Balance</th>
                <th className={th}>Guardian</th>
                <th className={th}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {owing?.map((s) => (
                <tr key={s.student_name}>
                  <td className={`${td} font-medium`}>{s.student_name}</td>
                  <td className={td}>{s.class_name}</td>
                  <td className={`${td} text-right font-mono text-status-owing-deep`}>{formatKobo(s.balance_kobo)}</td>
                  <td className={td}>{s.guardian_name}</td>
                  <td className={`${td} font-mono`}>{s.guardian_phone}</td>
                </tr>
              ))}
              {owing && (
                <tr className="font-semibold">
                  <td className="px-2 py-2" colSpan={2}>TOTAL OUTSTANDING</td>
                  <td className="px-2 py-2 text-right font-mono">
                    {formatKobo(owing.reduce((s, o) => s + o.balance_kobo, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              )}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="mt-16 grid grid-cols-2 gap-16 text-sm">
            <div>
              <div className="border-t border-ink-900 pt-2">Bursar</div>
            </div>
            <div>
              <div className="border-t border-ink-900 pt-2">Proprietor</div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <PoweredByNalto dark />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

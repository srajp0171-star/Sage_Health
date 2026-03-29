import { usePricingEngine } from '@/hooks/usePricingEngine'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'
import { usePdfExport } from '@/hooks/usePdfExport'
import { AGENCY } from '@/data/agency'
import { MODULES } from '@/data/modules'
import { formatINR, formatDateLong } from '@/utils/formatCurrency'
import { generateExecutiveSummary, generateAssumptions } from '@/utils/proposalGenerator'
import { Button } from '@/components/ui/Button'
import { Leaf, Download, Printer, ArrowLeft, Check, X as XIcon, Play } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COMPARISON_ROWS = [
  { feature: 'Ownership',       sage: 'Full ownership',          saas: 'Rented monthly' },
  { feature: 'Ongoing Cost',    sage: '₹0/month',                saas: '₹3,000–₹20,000/month' },
  { feature: 'Customization',   sage: 'Built for your clinic',   saas: 'One-size-fits-all' },
  { feature: 'Data Control',    sage: 'Your servers, your data', saas: 'Vendor holds your data' },
  { feature: 'Lock-in Risk',    sage: 'None',                    saas: 'Pricing can change anytime' },
]

export const ProposalScreen = () => {
  const pricing = usePricingEngine()
  const intake = useConfiguratorStore(s => s.intake)
  const { prevStep, goToStep } = useUIStore()

  const { isGenerating, exportPdf } = usePdfExport({
    elementId: 'proposal-content',
    clinicName: intake.clinicName,
  })

  const summary = generateExecutiveSummary(
    intake, pricing.selectedModules, pricing.totalOneTime,
    pricing.totalWeeks.min, pricing.totalWeeks.max,
  )
  const assumptions = generateAssumptions(intake, pricing.selectedModules)

  const unselectedModules = MODULES.filter(m => !pricing.selectedModules.some(s => s.id === m.id))

  const pieData = pricing.paymentMilestones.map((m, i) => ({
    name: m.label,
    value: m.amount,
    fill: ['#7CB987', '#A8D4B0', '#C9A84C'][i],
  }))

  return (
    <div>
      {/* Floating action bar */}
      <div className="sticky top-16 z-30 bg-dark-base/90 backdrop-blur-lg border-b border-dark-border py-3 px-4 flex items-center justify-between no-print pdf-hide">
        <Button variant="ghost" onClick={() => goToStep(2)}>
          <ArrowLeft className="w-4 h-4" /> Back to Configurator
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button onClick={exportPdf} isLoading={isGenerating}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button variant="primary" onClick={() => {
            const demoBaseUrl = import.meta.env.VITE_DEMO_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://sage-clinic.vercel.app');
            window.open(`${demoBaseUrl.replace(/\/$/, '')}/?mode=demo&clinic=${encodeURIComponent(intake.clinicName)}&modules=${pricing.selectedModules.map(m => m.id).join(',')}`, '_blank');
          }} className="bg-sage hover:bg-sage text-dark-base ml-2">
            <Play className="w-4 h-4 mr-2 inline" /> Launch Live Demo
          </Button>
        </div>
      </div>

      {/* Proposal content */}
      <div id="proposal-content" className="max-w-[794px] mx-auto bg-dark-card rounded-xl border border-dark-border my-8 p-8 pdf-bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-sage pb-4 mb-8 pdf-border-sage">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-sage pdf-text-sage" />
            <span className="font-display text-xl pdf-text-sage">{AGENCY.name}</span>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>{formatDateLong()}</p>
            <p>Prepared for: <strong className="text-white">{intake.clinicName}</strong></p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 italic mb-8">{AGENCY.tagline}</p>

        {/* Executive Summary */}
        <h2 className="font-display text-xl text-sage mb-4 pdf-text-sage">Executive Summary</h2>
        {summary.map((p, i) => (
          <p key={i} className="text-sm text-gray-300 mb-3 leading-relaxed">{p}</p>
        ))}

        {/* Selected Modules Table */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Selected Modules</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-dark-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-sage/10">
                <th className="text-left py-2.5 px-3 text-sage font-medium">#</th>
                <th className="text-left py-2.5 px-3 text-sage font-medium">Module</th>
                <th className="text-left py-2.5 px-3 text-sage font-medium hidden sm:table-cell">What It Does</th>
                <th className="text-center py-2.5 px-3 text-sage font-medium">Timeline</th>
                <th className="text-right py-2.5 px-3 text-sage font-medium">Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {pricing.selectedModules.map((m, i) => (
                <tr key={m.id} className="border-t border-dark-border/50">
                  <td className="py-2.5 px-3 text-gray-500">{i + 1}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{m.name}</td>
                  <td className="py-2.5 px-3 text-gray-400 hidden sm:table-cell">{m.clientValue}</td>
                  <td className="py-2.5 px-3 text-center text-gray-400">{m.weeksMin}–{m.weeksMax}w</td>
                  <td className="py-2.5 px-3 text-right font-mono text-white">{formatINR(m.oneTime)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-sage/30 font-semibold">
                <td colSpan={4} className="py-2.5 px-3 text-white text-right">Subtotal</td>
                <td className="py-2.5 px-3 text-right font-mono text-white">{formatINR(pricing.subtotal)}</td>
              </tr>
              {pricing.totalDiscount > 0 && (
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-sage text-right text-xs">
                    Discount ({pricing.appliedBundle?.name})
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-sage">-{formatINR(pricing.totalDiscount)}</td>
                </tr>
              )}
              <tr className="border-t border-dark-border/50">
                <td colSpan={4} className="py-2 px-3 text-gray-400 text-right text-xs">Total (ex-GST)</td>
                <td className="py-2 px-3 text-right font-mono text-white">{formatINR(pricing.totalOneTime)}</td>
              </tr>
              {pricing.gstAmount > 0 && (
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-gray-400 text-right text-xs">GST (18%)</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-400">{formatINR(pricing.gstAmount)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-sage/30 font-bold">
                <td colSpan={4} className="py-2.5 px-3 text-sage text-right">Grand Total</td>
                <td className="py-2.5 px-3 text-right font-mono text-sage text-lg">{formatINR(pricing.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Optional add-ons */}
        {unselectedModules.length > 0 && (
          <>
            <h2 className="font-display text-xl text-gray-500 mt-10 mb-2">Optional Add-On Modules</h2>
            <p className="text-xs text-gray-500 mb-4">These capabilities can be added at any time as your practice grows.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {unselectedModules.map(m => (
                <div key={m.id} className="text-xs text-gray-500 bg-dark-base/50 rounded px-3 py-2 border border-dark-border/50">
                  {m.name} — {formatINR(m.oneTime)}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Investment Breakdown */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Investment Breakdown</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="font-mono">{formatINR(pricing.subtotal)}</span></div>
            {pricing.totalDiscount > 0 && <div className="flex justify-between text-sage"><span>Discount</span><span className="font-mono">-{formatINR(pricing.totalDiscount)}</span></div>}
            <div className="flex justify-between text-gray-400"><span>Total (ex-GST)</span><span className="font-mono">{formatINR(pricing.totalOneTime)}</span></div>
            {pricing.gstAmount > 0 && <div className="flex justify-between text-gray-400"><span>GST (18%)</span><span className="font-mono">{formatINR(pricing.gstAmount)}</span></div>}
            <div className="flex justify-between text-white font-bold border-t border-dark-border pt-2"><span>Grand Total</span><span className="font-mono">{formatINR(pricing.grandTotal)}</span></div>
            <div className="pt-3 border-t border-dark-border space-y-1">
              {pricing.paymentMilestones.map(m => (
                <div key={m.label} className="flex justify-between text-xs text-gray-400">
                  <span>{m.pct}% — {m.label}</span><span className="font-mono">{formatINR(m.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Why not SaaS */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Why Not a SaaS Subscription?</h2>
        <table className="w-full text-sm mb-4">
          <thead><tr className="border-b border-dark-border">
            <th className="text-left py-2 px-3 text-gray-400">Feature</th>
            <th className="text-left py-2 px-3 text-sage">Sage Tech</th>
            <th className="text-left py-2 px-3 text-red-400">SaaS</th>
          </tr></thead>
          <tbody>{COMPARISON_ROWS.map(r => (
            <tr key={r.feature} className="border-b border-dark-border/30">
              <td className="py-2 px-3 text-white">{r.feature}</td>
              <td className="py-2 px-3 text-gray-300"><Check className="w-3 h-3 text-sage inline mr-1" />{r.sage}</td>
              <td className="py-2 px-3 text-gray-500"><XIcon className="w-3 h-3 text-red-400 inline mr-1" />{r.saas}</td>
            </tr>
          ))}</tbody>
        </table>
        <p className="text-xs text-gray-400">
          Over 5 years, comparable SaaS tools would cost {formatINR(pricing.saasMonthlyLow * 60)}–{formatINR(pricing.saasMonthlyHigh * 60)}. You invest {formatINR(pricing.grandTotal)} once and own it forever.
        </p>

        {/* Project Phases */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Project Phases</h2>
        <div className="space-y-3">
          {pricing.phases.map((phase, i) => (
            <div key={phase.name} className="bg-dark-base/30 rounded-lg p-4 border border-dark-border/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-white">Phase {i + 1}: {phase.name}</h3>
                <span className="text-xs font-mono text-gray-500">{phase.weeksMin}–{phase.weeksMax} weeks</span>
              </div>
              <ul className="space-y-1">
                {phase.activities.map((a, ai) => (
                  <li key={ai} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="text-sage">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Maintenance */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Maintenance & Support</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="bg-dark-base/30 rounded-lg p-4 border border-dark-border/30">
            <p className="font-medium text-white mb-2">First {AGENCY.maintenanceFreeMonths} months</p>
            <p>{AGENCY.maintenanceFreeCount} free maintenance engagements (bug fixes, minor UI/content changes, security updates)</p>
          </div>
          <div className="bg-dark-base/30 rounded-lg p-4 border border-dark-border/30">
            <p className="font-medium text-white mb-2">After {AGENCY.maintenanceFreeMonths} months</p>
            <p>{formatINR(AGENCY.maintenanceRateLow)}–{formatINR(AGENCY.maintenanceRateHigh)} per engagement based on scope</p>
          </div>
        </div>

        {/* Assumptions */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Assumptions & Exclusions</h2>
        <ul className="space-y-2 text-sm text-gray-400">
          {assumptions.map((a, i) => <li key={i} className="flex items-start gap-2"><span className="text-sage">•</span>{a}</li>)}
        </ul>

        {/* Next Steps */}
        <h2 className="font-display text-xl text-sage mt-10 mb-4 pdf-text-sage">Next Steps</h2>
        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
          <li>Confirm module scope and sign the engagement letter</li>
          <li>Pay 40% advance ({formatINR(pricing.paymentMilestones[0]?.amount ?? 0)}) to begin</li>
          <li>Kick off discovery call within 3–5 business days</li>
        </ol>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-dark-border text-center text-xs text-gray-600">
          {AGENCY.name} | {AGENCY.website} | {AGENCY.email} | {AGENCY.phone} | Confidential — prepared exclusively for {intake.clinicName}
        </div>
      </div>
    </div>
  )
}

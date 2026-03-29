import { usePricingEngine } from '@/hooks/usePricingEngine'
import { useUIStore } from '@/store/uiStore'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Button } from '@/components/ui/Button'
import { formatINR, formatMonthly } from '@/utils/formatCurrency'
import { Lock, DollarSign, Wrench, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { clsx } from 'clsx'

export const PricingPanel = () => {
  const pricing = usePricingEngine()
  const { nextStep } = useUIStore()
  const intake = useConfiguratorStore(s => s.intake)

  const chartData = [
    { name: 'SaaS (5yr)', value: pricing.saasMonthlyHigh * 60, fill: '#F85149' },
    { name: 'Sage Tech', value: pricing.grandTotal, fill: '#7CB987' },
  ]

  return (
    <aside className="w-80 shrink-0 hidden xl:block sticky top-20 h-fit">
      <div className="bg-dark-panel border border-dark-border rounded-xl p-5 space-y-5">
        {/* Investment Summary */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Investment Summary</p>
          <p className="text-sm text-gray-400 mb-2">{pricing.moduleCount} modules selected</p>
          <AnimatedNumber
            value={pricing.totalOneTime}
            className="block font-mono text-3xl font-bold text-sage"
          />
          {pricing.appliedBundle && (
            <span className="inline-block mt-2 text-xs bg-sage/10 text-sage px-2 py-1 rounded-full">
              {pricing.appliedBundle.name} — {pricing.appliedBundle.discountPct}% off
            </span>
          )}
          {pricing.volumeDiscount && (
            <span className="inline-block mt-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
              {pricing.volumeDiscount.label}
            </span>
          )}
        </div>

        <div className="border-t border-dark-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>36-month equivalent</span>
            <span className="font-mono">{formatMonthly(pricing.totalOneTime)}</span>
          </div>
          <div className="flex justify-between text-gold">
            <span>SaaS alternative</span>
            <span className="font-mono">{formatINR(pricing.saasMonthlyLow)}–{formatINR(pricing.saasMonthlyHigh)}/mo</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Est. go-live</span>
            <span className="font-mono">{pricing.totalWeeks.min}–{pricing.totalWeeks.max} weeks</span>
          </div>
          <p className="text-xs text-gray-600 pt-1">+18% GST applicable</p>
        </div>

        {/* Payment milestones */}
        <div className="border-t border-dark-border pt-4">
          <p className="text-xs text-gray-500 mb-2">Payment Milestones</p>
          {pricing.paymentMilestones.map(m => (
            <div key={m.label} className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{m.pct}% — {m.label}</span>
              <span className="font-mono">{formatINR(m.amount)}</span>
            </div>
          ))}
        </div>

        {/* EMI Option */}
        {pricing.grandTotal > 0 && (
          <div className="border-t border-dark-border pt-4">
            <div className="bg-sage/5 border border-sage/20 rounded-md p-3">
              <p className="text-[10px] text-sage font-bold uppercase tracking-wider mb-1">Financing Available</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">0% EMI (12 Months)</span>
                <span className="font-mono text-sm text-sage font-medium">{formatINR(Math.round(pricing.grandTotal / 12))}/mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Value pillars */}
        <div className="border-t border-dark-border pt-4 space-y-3">
          {[
            { icon: Lock, title: 'Full ownership', desc: 'No renewals, no lock-in' },
            { icon: DollarSign, title: 'One-time cost', desc: 'SaaS charges forever' },
            { icon: Wrench, title: 'Maintained your way', desc: 'Pay only when needed' },
            { icon: TrendingUp, title: 'Built to scale', desc: 'Add modules anytime' },
          ].map(v => (
            <div key={v.title} className="flex items-start gap-2.5">
              <v.icon className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{v.title}</p>
                <p className="text-xs text-gray-500">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="border-t border-dark-border pt-4">
          <p className="text-xs text-gray-500 mb-2">5-Year Cost Comparison</p>
          <div style={{ width: '100%', height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <XAxis dataKey="name" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {pricing.savings5yrHigh > 0 && (
            <p className="text-xs text-gold text-center mt-1">
              Save {formatINR(pricing.savings5yrLow)}–{formatINR(pricing.savings5yrHigh)} over 5 years
            </p>
          )}
        </div>

        {/* Budget warning */}
        {pricing.budgetStatus === 'over' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-300">
              {formatINR(Math.abs(pricing.budgetDelta))} above your target budget. Consider removing optional modules.
            </p>
          </div>
        )}
        {pricing.budgetStatus === 'within' && pricing.moduleCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Within budget</span>
          </div>
        )}

        {/* Timeline warning */}
        {pricing.totalWeeks.max > 14 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300">
            Large scope detected. We recommend a phased approach.
          </div>
        )}

        {/* CTA */}
        <Button
          fullWidth
          size="lg"
          onClick={nextStep}
          disabled={pricing.moduleCount === 0}
        >
          Generate Value Proposal →
        </Button>
      </div>
    </aside>
  )
}

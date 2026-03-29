import { usePricingEngine } from '@/hooks/usePricingEngine'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/utils/formatCurrency'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Check, X as XIcon } from 'lucide-react'

const COMPARISON_ROWS = [
  { feature: 'Ownership',          sage: 'Full ownership',              saas: 'Rented monthly' },
  { feature: 'Ongoing Cost',       sage: '₹0/month',                   saas: '₹3,000–₹20,000/month' },
  { feature: 'Customization',      sage: 'Built for your clinic',      saas: 'One-size-fits-all' },
  { feature: 'Data Control',       sage: 'Your servers, your data',    saas: 'Vendor holds your data' },
  { feature: 'Maintenance',        sage: 'Pay only when needed',       saas: 'Locked support plans' },
  { feature: 'Module Flexibility', sage: 'Only what you need',         saas: 'Paying for unused features' },
  { feature: 'Branding',           sage: '100% your brand',            saas: 'Vendor branding visible' },
  { feature: 'Lock-in Risk',       sage: 'None',                       saas: 'Pricing can change anytime' },
  { feature: 'Support',            sage: 'Direct team, responsive',    saas: 'Ticket queues' },
]

export const ValuePitchScreen = () => {
  const pricing = usePricingEngine()
  const intake = useConfiguratorStore(s => s.intake)
  const { nextStep, prevStep } = useUIStore()

  // Build 60-month chart data
  const saasMonthly = pricing.saasMonthlyHigh
  const chartData = Array.from({ length: 61 }, (_, month) => ({
    month,
    saas:  saasMonthly * month,
    sage:  pricing.grandTotal,
  }))

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8 animate-fade-up">
      {/* Card 1: Ownership vs Subscription */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl text-red-400 mb-4">The SaaS Trap</h3>
          <p className="font-mono text-4xl text-red-400 mb-2">
            {formatINR(saasMonthly)} × 60
          </p>
          <p className="font-mono text-2xl text-red-300 mb-4">
            = {formatINR(saasMonthly * 60)}
          </p>
          <p className="text-sm text-gray-400">&hellip; and you own nothing.</p>
        </div>
        <div className="bg-sage/5 border border-sage/20 rounded-2xl p-8 text-center flex flex-col justify-center">
          <h3 className="font-display text-xl text-sage mb-4">The Sage Tech Way</h3>
          <p className="font-mono text-4xl text-sage mb-2">
            {formatINR(pricing.grandTotal)}
          </p>
          <p className="text-lg text-sage-light mb-4">One time. Own forever.</p>
          <p className="text-sm text-gray-400">Your data. Your platform. Your brand.</p>
        </div>
      </section>

      {/* The Aggregator Trap */}
      <section className="bg-dark-panel border border-red-500/20 rounded-2xl p-8 relative overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="font-display text-2xl text-red-400 mb-2">The Hidden "Aggregator Tax"</h2>
          <p className="text-gray-400 mb-6 max-w-3xl leading-relaxed">
            Platforms like Practo and Lybrate charge up to 20% commission on every booking. If your clinic processes 20 online patients a day at ₹500/consult, you are bleeding <strong className="text-red-300">₹60,000 every single month</strong> in fees.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 bg-dark-bg border border-red-900/30 rounded-xl p-5 w-full text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Yearly Commission Lost</p>
              <p className="font-mono text-3xl text-red-400">₹7,20,000</p>
              <p className="text-xs text-red-500/70 mt-1">Gives away your patient data too</p>
            </div>
            <div className="text-gray-600 font-bold text-lg px-2 hidden md:block">VS</div>
            <div className="flex-1 bg-sage/10 border border-sage/20 rounded-xl p-5 w-full text-center md:text-left">
              <p className="text-sm text-sage-light mb-1 uppercase tracking-wider">Sage Tech One-Time Cost</p>
              <p className="font-mono text-3xl text-sage">{formatINR(pricing.grandTotal)}</p>
              <p className="text-xs text-sage/70 mt-1">
                Pays for itself in just {Math.max(1, Math.ceil(pricing.grandTotal / 60000))} month(s)!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Comparison Table */}
      <section>
        <h2 className="font-display text-2xl text-white text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-gray-400 py-3 px-4 font-body">Feature</th>
                <th className="text-left text-sage py-3 px-4 font-body">Sage Tech Solutions</th>
                <th className="text-left text-red-400 py-3 px-4 font-body">Generic SaaS</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-dark-border/50 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <td className="py-3 px-4 text-white font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-gray-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-sage shrink-0" />
                    {row.sage}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <XIcon className="w-4 h-4 text-red-400 shrink-0" />
                      {row.saas}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Card 3: 5-Year ROI Chart */}
      <section>
        <h2 className="font-display text-2xl text-white text-center mb-6">5-Year ROI</h2>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#2D333B" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#8B949E', fontSize: 11 }} label={{ value: 'Months', position: 'bottom', fill: '#8B949E' }} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#161B22', border: '1px solid #2D333B', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => [formatINR(value), name === 'saas' ? 'SaaS Cumulative' : 'Sage Tech']}
              />
              <Area type="monotone" dataKey="saas" fill="#F85149" fillOpacity={0.15} stroke="#F85149" strokeWidth={2} name="saas" />
              <Area type="monotone" dataKey="sage" fill="#7CB987" fillOpacity={0.1} stroke="#7CB987" strokeWidth={2} name="sage" />
              {pricing.breakEvenMonth > 0 && pricing.breakEvenMonth <= 60 && (
                <ReferenceLine x={pricing.breakEvenMonth} stroke="#C9A84C" strokeDasharray="5 5" label={{ value: `Break-even`, fill: '#C9A84C', fontSize: 11 }} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {pricing.savings5yrHigh > 0 && (
          <p className="text-center text-gold font-mono text-lg mt-4">
            You save {formatINR(pricing.savings5yrLow)}–{formatINR(pricing.savings5yrHigh)} over 5 years
          </p>
        )}
      </section>

      {/* Card 4: Configuration Summary */}
      <section className="text-center">
        <h2 className="font-display text-2xl text-white mb-4">
          Here&rsquo;s what we&rsquo;re building for {intake.clinicName || 'your clinic'}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {pricing.selectedModules.map(m => (
            <span key={m.id} className="bg-sage/10 text-sage text-sm px-3 py-1.5 rounded-full border border-sage/20">
              {m.name}
            </span>
          ))}
        </div>
        <p className="text-gray-400 mb-8">
          {pricing.moduleCount} modules &middot; {pricing.totalWeeks.min}–{pricing.totalWeeks.max} weeks &middot; {formatINR(pricing.totalOneTime)} one-time
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" onClick={prevStep}>← Back to Modules</Button>
          <Button size="lg" onClick={nextStep}>Generate Full Proposal →</Button>
        </div>
      </section>
    </div>
  )
}

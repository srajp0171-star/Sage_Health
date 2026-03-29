import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { formatINR } from '@/utils/formatCurrency'
import { MODULES } from '@/data/modules'
import { CATEGORIES } from '@/data/categories'
import { AGENCY } from '@/data/agency'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { ArrowRight, Leaf, Shield, DollarSign, Code, Zap, Check } from 'lucide-react'

const saasMonthly = MODULES.reduce((s, m) => s + m.saasHigh, 0)
const sageTotal   = MODULES.reduce((s, m) => s + m.oneTime, 0)
const chartData   = Array.from({ length: 61 }, (_, month) => ({
  month,
  saas: saasMonthly * month,
  sage: sageTotal,
}))

const VALUE_PILLARS = [
  { icon: Shield,     title: 'You Own It',          desc: 'No subscriptions, no recurring fees, no lock-in. The code is yours.' },
  { icon: DollarSign, title: 'One-Time Investment', desc: 'Pay once and save lakhs compared to SaaS subscriptions over 5 years.' },
  { icon: Code,       title: 'Fully Customizable',  desc: 'Built specifically for your clinic. Not a template. Not one-size-fits-all.' },
  { icon: Zap,        title: 'Go Live in Weeks',    desc: 'Modular approach means we ship fast. Start with basics, add modules later.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Tell Us About Your Clinic', desc: 'Fill in a quick profile — size, speciality, daily volume, goals.' },
  { step: '02', title: 'Get Smart Recommendations', desc: 'Our engine recommends the exact modules your clinic needs.' },
  { step: '03', title: 'Fine-Tune & Compare',       desc: 'Toggle modules on/off. See the price, timeline, and SaaS comparison in real time.' },
  { step: '04', title: 'Download Your Proposal',    desc: 'Get a professional PDF proposal with every detail — ready to share.' },
]

export default function LandingPage() {
  return (
    <div className="bg-dark-base text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="w-8 h-8 text-sage animate-pulse-glow" />
            <span className="font-display text-2xl text-sage">{AGENCY.name}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-white mb-6 leading-tight">
            Build Your Clinic&rsquo;s Digital Platform.<br />
            <span className="text-sage">Own It Forever.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Stop paying monthly SaaS fees for cookie-cutter software. Configure a custom healthcare platform — website, booking, EMR, billing, and more — for a one-time investment.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/configure">
              <Button size="lg">
                Start Configuring <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#comparison">
              <Button variant="secondary" size="lg">See the ROI</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((pill, i) => (
            <div
              key={pill.title}
              className="bg-dark-card border border-dark-border rounded-xl p-6 text-center animate-fade-up hover:border-sage/30 transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <pill.icon className="w-8 h-8 text-sage mx-auto mb-4" />
              <h3 className="font-display text-lg mb-2">{pill.title}</h3>
              <p className="text-sm text-gray-400">{pill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Module Showcase */}
      <section id="modules" className="py-20 px-4 bg-dark-sidebar">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-4">23 Modules. Your Pick.</h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">Every module is priced individually. Choose only what your clinic needs.</p>
          <div className="space-y-10">
            {CATEGORIES.map(cat => {
              const catModules = MODULES.filter(m => m.category === cat.id)
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <h3 className="font-display text-lg text-white">{cat.label}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catModules.map(m => (
                      <div key={m.id} className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-start gap-3 hover:border-sage/30 transition-colors">
                        <DynamicIcon name={m.icon} className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white truncate">{m.name}</p>
                            <Badge variant={m.badge as 'recommended' | 'advanced' | 'optional'} className="text-[10px] shrink-0">{m.badge}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{m.clientValue}</p>
                          <p className="text-xs font-mono text-sage mt-1">{formatINR(m.oneTime)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="text-center animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="font-mono text-3xl text-sage/50 font-bold">{step.step}</span>
                <h3 className="font-display text-lg text-white mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Year Comparison Chart */}
      <section id="comparison" className="py-20 px-4 bg-dark-sidebar">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-2">SaaS vs Ownership: 5-Year View</h2>
          <p className="text-center text-gray-400 mb-10 text-sm">All {MODULES.length} modules selected for illustration</p>
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke="#2D333B" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#8B949E', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{ background: '#161B22', border: '1px solid #2D333B', borderRadius: 8, fontSize: 12 }}
                  formatter={(val: number, name: string) => [formatINR(val), name === 'saas' ? 'SaaS Cumulative' : 'Sage Tech One-Time']}
                />
                <Area type="monotone" dataKey="saas" fill="#F85149" fillOpacity={0.15} stroke="#F85149" strokeWidth={2} name="saas" />
                <Area type="monotone" dataKey="sage" fill="#7CB987" fillOpacity={0.1} stroke="#7CB987" strokeWidth={2} name="sage" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-gold font-mono text-lg mt-6">
            Save up to {formatINR(saasMonthly * 60 - sageTotal)} over 5 years
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-display text-3xl mb-4">Ready to Build?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Configure your clinic&rsquo;s ideal solution in under 5 minutes. See smart recommendations, transparent pricing, and a ready-to-share proposal.</p>
        <Link to="/configure">
          <Button size="lg">Start Configuring <ArrowRight className="w-5 h-5" /></Button>
        </Link>
      </section>
    </div>
  )
}

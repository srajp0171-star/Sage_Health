import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useApp, SectionTitle } from '../ui'
import { ANALYTICS } from '../data'
import { formatINR } from '../utils'

export default function AnalyticsModule() {
  const { state } = useApp()
  const opdData = ANALYTICS.months.map((m, i) => ({ month: m, value: ANALYTICS.monthlyOPD[i] }))
  const revData = ANALYTICS.months.map((m, i) => ({ month: m, value: ANALYTICS.monthlyRevenue[i] }))
  const noShowData = ANALYTICS.months.map((m, i) => ({ month: m, value: ANALYTICS.noShowRate[i] }))
  const perfData = ANALYTICS.doctorPerformance.map(d => ({ name: d.name, patients: d.patients, revenue: d.revenue / 1000 }))
  const pieData = [{ name: 'Returning', value: 340 }, { name: 'New', value: 88 }]
  const COLORS = ['#6DBF8A', '#F0B429']

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Analytics & Reports" subtitle="12-month performance overview" />
      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}><p className="text-muted" style={{ fontSize: 12 }}>Total OPD (Jul)</p><p className="mono" style={{ fontSize: 24, color: '#6DBF8A' }}>48</p></div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}><p className="text-muted" style={{ fontSize: 12 }}>Revenue (Jul)</p><p className="mono" style={{ fontSize: 24, color: '#4A9EFF' }}>{formatINR(28800)}</p></div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}><p className="text-muted" style={{ fontSize: 12 }}>Avg No-Show</p><p className="mono" style={{ fontSize: 24, color: '#F0B429' }}>13%</p></div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}><p className="text-muted" style={{ fontSize: 12 }}>Top Doctor</p><p style={{ fontSize: 14, color: '#A78BFA' }}>Dr. Sharma</p><p className="mono text-muted" style={{ fontSize: 12 }}>{formatINR(158400)}</p></div>
      </div>

      {/* OPD Volume */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 className="card-title">OPD Volume Trend</h4>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={opdData}>
              <defs><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6DBF8A" stopOpacity={0.3} /><stop offset="95%" stopColor="#6DBF8A" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
              <XAxis dataKey="month" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
              <YAxis stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
              <Area type="monotone" dataKey="value" stroke="#6DBF8A" fill="url(#sg2)" strokeWidth={2} name="Patients" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-row">
        {/* Revenue */}
        <div className="card">
          <h4 className="card-title">Monthly Revenue</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
                <XAxis dataKey="month" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <YAxis stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} formatter={(v: any) => formatINR(Number(v))} />
                <ReferenceLine y={25000} stroke="#F0B429" strokeDasharray="4 4" label={{ value: 'Target', fill: '#F0B429', fontSize: 11 }} />
                <Bar dataKey="value" fill="#6DBF8A" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* No-Show */}
        <div className="card">
          <h4 className="card-title">No-Show Rate (%)</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={noShowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
                <XAxis dataKey="month" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <YAxis stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
                <ReferenceLine y={10} stroke="#6DBF8A" strokeDasharray="4 4" label={{ value: 'Target', fill: '#6DBF8A', fontSize: 11 }} />
                <Line type="monotone" dataKey="value" stroke="#F45B5B" strokeWidth={2} dot={{ r: 3, fill: '#F45B5B' }} name="No-Show %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-row" style={{ marginTop: 20 }}>
        {/* Doctor Perf */}
        <div className="card">
          <h4 className="card-title">Doctor Performance</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
                <XAxis type="number" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={80} stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
                <Bar dataKey="patients" fill="#6DBF8A" radius={[0, 4, 4, 0]} name="Patients" />
                <Bar dataKey="revenue" fill="#A78BFA" radius={[0, 4, 4, 0]} name="Revenue (₹K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Type Donut */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 className="card-title" style={{ alignSelf: 'flex-start' }}>Patient Type</h4>
          <div style={{ width: '100%', height: 220, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <p className="mono" style={{ fontSize: 22, color: '#F0F4FF' }}>428</p>
              <p className="text-muted" style={{ fontSize: 11 }}>Total</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {pieData.map((d, i) => <span key={d.name} className="text-muted" style={{ fontSize: 12 }}><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: COLORS[i], marginRight: 4 }} />{d.name}: {d.value}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Calendar, Users, IndianRupee, AlertTriangle, Check, Clock, Eye, XCircle, Plus, Filter } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, StatCard, StatusBadge, Button, Modal, Avatar, SectionTitle, Tabs } from '../ui'
import { ANALYTICS, DOCTORS } from '../data'
import { formatINR, formatDate, formatTime12, isToday, newId } from '../utils'

export default function Dashboard() {
  const { state, dispatch, addToast } = useApp()
  const [filter, setFilter] = useState('all')
  const [clock, setClock] = useState(new Date())
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t) }, [])

  const todayAppts = state.appointments.filter(a => isToday(a.date))
  const completed = todayAppts.filter(a => a.status === 'Completed').length
  const active = todayAppts.filter(a => ['In Queue', 'Waiting'].includes(a.status)).length
  const scheduled = todayAppts.filter(a => a.status === 'Scheduled').length
  const todayRev = state.invoices.filter(i => isToday(i.date)).reduce((s, i) => s + i.paid, 0)
  const waiting = todayAppts.filter(a => a.status === 'Waiting').length
  const lowStock = state.pharmacy.filter(m => m.stock < m.threshold).length

  const filtered = todayAppts.filter(a => {
    if (filter === 'morning') return parseInt(a.time) < 12
    if (filter === 'afternoon') return parseInt(a.time) >= 12
    return true
  }).sort((a, b) => a.time.localeCompare(b.time))

  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const getDoctor = (id: string) => DOCTORS.find(d => d.id === id)

  const chartData = ANALYTICS.months.map((m, i) => ({ month: m, opd: ANALYTICS.monthlyOPD[i], revenue: ANALYTICS.monthlyRevenue[i] / 1000 }))
  const perfData = ANALYTICS.doctorPerformance.map(d => ({ name: d.name, patients: d.patients }))

  const markComplete = (id: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id, status: 'Completed' })
    addToast('success', '✓ Appointment marked as completed')
  }

  const cancelAppt = (id: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id, status: 'Cancelled' })
    addToast('info', '↻ Appointment cancelled')
  }

  /* Quick booking mini-form */
  const [bDoc, setBDoc] = useState('')
  const [bPat, setBPat] = useState('')
  const [bTime, setBTime] = useState('')
  const [bType, setBType] = useState('Consultation')

  const handleBook = () => {
    if (!bDoc || !bPat || !bTime) return
    const doc = DOCTORS.find(d => d.id === bDoc)
    const appt = { id: newId('A', state.appointments), patientId: bPat, doctorId: bDoc, date: state.todayDate, time: bTime, status: 'Scheduled', type: bType, fee: doc?.fee || 600, notes: '' }
    dispatch({ type: 'BOOK_APPOINTMENT', payload: appt })
    addToast('success', `✓ Appointment booked – ${doc?.name}, ${formatTime12(bTime)}`)
    setShowBooking(false); setBDoc(''); setBPat(''); setBTime('')
  }

  return (
    <div className="module-page fade-in">
      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon={Calendar} title="Today's Appointments" value={todayAppts.length} subtitle={`✓${completed} done · ⏳${active} active · 📅${scheduled} upcoming`} color="#6DBF8A" />
        <StatCard icon={IndianRupee} title="Today's Revenue" value={formatINR(todayRev)} subtitle="From completed consultations" color="#4A9EFF" />
        <StatCard icon={Users} title="Patients Waiting" value={waiting} subtitle="In queue right now" color="#F0B429" />
        <StatCard icon={AlertTriangle} title="Pharmacy Alerts" value={lowStock} subtitle="Low stock items" color="#F45B5B" />
      </div>

      <div className="dashboard-grid">
        {/* Left: Today's List */}
        <div className="card">
          <SectionTitle title="Today's Appointments" subtitle={`${state.todayDate} – ${todayAppts.length} total`}
            action={<Button onClick={() => setShowBooking(true)} size="sm"><Plus size={14} /> Add Appointment</Button>} />
          <Tabs tabs={[{ key: 'all', label: 'All' }, { key: 'morning', label: 'Morning' }, { key: 'afternoon', label: 'Afternoon' }]} active={filter} onChange={setFilter} />
          <div className="appt-list">
            {filtered.map((a, i) => {
              const p = getPatient(a.patientId)
              const d = getDoctor(a.doctorId)
              return (
                <div key={a.id} className={`appt-row ${a.status === 'In Queue' ? 'appt-row--active' : ''}`}>
                  <span className="appt-token">T-{String(i + 1).padStart(2, '0')}</span>
                  <div className="appt-info">
                    <div className="appt-patient">{p?.name || 'Unknown'} <span className="text-muted">({p?.age}{p?.gender?.[0]})</span></div>
                    <div className="text-muted text-xs">{d?.name} · {a.type}</div>
                  </div>
                  <span className="appt-time mono">{formatTime12(a.time)}</span>
                  <StatusBadge status={a.status} />
                  <div className="appt-actions">
                    {a.status === 'Scheduled' && <button className="icon-btn icon-btn--sage" title="Start" onClick={() => dispatch({ type: 'UPDATE_APPT_STATUS', id: a.id, status: 'In Queue' })}><Clock size={14} /></button>}
                    {['Waiting', 'In Queue'].includes(a.status) && <button className="icon-btn icon-btn--green" title="Complete" onClick={() => markComplete(a.id)}><Check size={14} /></button>}
                    {a.status !== 'Completed' && a.status !== 'Cancelled' && <button className="icon-btn icon-btn--red" title="Cancel" onClick={() => cancelAppt(a.id)}><XCircle size={14} /></button>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Charts */}
        <div className="dashboard-charts">
          <div className="card">
            <h4 className="card-title">Revenue & OPD Trend (12 months)</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="sageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6DBF8A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6DBF8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
                  <XAxis dataKey="month" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                  <YAxis stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
                  <Area type="monotone" dataKey="opd" stroke="#6DBF8A" fill="url(#sageGrad)" strokeWidth={2} name="OPD" />
                  <Area type="monotone" dataKey="revenue" stroke="#F0B429" fill="transparent" strokeWidth={2} strokeDasharray="4 4" name="Revenue (₹K)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h4 className="card-title">Doctor Performance (Patients)</h4>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3347" />
                  <XAxis dataKey="name" stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                  <YAxis stroke="#4A5568" tick={{ fill: '#8896B0', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1C2537', border: '1px solid #2A3347', borderRadius: 8, color: '#F0F4FF' }} />
                  <Bar dataKey="patients" fill="#6DBF8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Clock */}
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <p className="mono" style={{ fontSize: 28, color: '#6DBF8A', fontWeight: 600 }}>{clock.toLocaleTimeString('en-IN', { hour12: true })}</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Demo date: Mon, 7 Jul 2025</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBooking} onClose={() => setShowBooking(false)} title="Quick Appointment Booking">
        <div className="form-stack">
          <div className="form-group">
            <label className="form-label">Doctor</label>
            <select className="form-input" value={bDoc} onChange={e => setBDoc(e.target.value)}>
              <option value="">Select doctor...</option>
              {state.doctors.filter(d => d.available).map(d => <option key={d.id} value={d.id}>{d.name} – {d.speciality}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select className="form-input" value={bPat} onChange={e => setBPat(e.target.value)}>
              <option value="">Select patient...</option>
              {state.patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Time</label>
              <select className="form-input" value={bTime} onChange={e => setBTime(e.target.value)}>
                <option value="">Select slot...</option>
                {bDoc && state.doctors.find(d => d.id === bDoc)?.slots.map(s => {
                  const taken = state.appointments.some(a => a.doctorId === bDoc && a.date === state.todayDate && a.time === s && a.status !== 'Cancelled')
                  return <option key={s} value={s} disabled={taken}>{formatTime12(s)} {taken ? '(Booked)' : ''}</option>
                })}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={bType} onChange={e => setBType(e.target.value)}>
                <option>Consultation</option><option>Follow-up</option><option>New Patient</option>
              </select>
            </div>
          </div>
          <Button onClick={handleBook} className="w-full">Confirm Booking</Button>
        </div>
      </Modal>
    </div>
  )
}

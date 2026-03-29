import { useState } from 'react'
import { Calendar, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useApp, StatusBadge, Button, Modal, Tabs, EmptyState, SectionTitle } from '../ui'
import { DOCTORS } from '../data'
import { formatDate, formatTime12, isToday, isFuture, isPast, newId } from '../utils'

export default function BookingModule() {
  const { state, dispatch, addToast } = useApp()
  const [tab, setTab] = useState('calendar')
  const [showBooking, setShowBooking] = useState(false)
  const [step, setStep] = useState(0)
  const [bDoc, setBDoc] = useState('')
  const [bDate, setBDate] = useState(state.todayDate)
  const [bTime, setBTime] = useState('')
  const [bPat, setBPat] = useState('')
  const [bNewPatient, setBNewPatient] = useState(false)
  const [bName, setBName] = useState('')
  const [bPhone, setBPhone] = useState('')
  const [bAge, setBAge] = useState('')
  const [bGender, setBGender] = useState('Male')
  const [listFilter, setListFilter] = useState({ doctor: '', status: '' })

  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const getDoctor = (id: string) => state.doctors.find(d => d.id === id)

  const handleBook = () => {
    let patId = bPat
    if (bNewPatient && bName && bPhone) {
      const newP = { id: newId('P', state.patients), name: bName, age: Number(bAge) || 0, gender: bGender, phone: bPhone, email: '', blood: '', address: '', lastVisit: bDate, totalVisits: 0, balance: 0, allergies: [] as string[], conditions: [] as string[] }
      dispatch({ type: 'ADD_PATIENT', payload: newP })
      patId = newP.id
    }
    if (!bDoc || !bTime || !patId) return
    const doc = getDoctor(bDoc)
    const appt = { id: newId('A', state.appointments), patientId: patId, doctorId: bDoc, date: bDate, time: bTime, status: 'Scheduled', type: 'Consultation', fee: doc?.fee || 600, notes: '' }
    dispatch({ type: 'BOOK_APPOINTMENT', payload: appt })
    addToast('success', `✓ Appointment booked – ${doc?.name}, ${formatDate(bDate)} ${formatTime12(bTime)}`)
    setShowBooking(false)
    resetForm()
  }

  const resetForm = () => { setStep(0); setBDoc(''); setBDate(state.todayDate); setBTime(''); setBPat(''); setBNewPatient(false); setBName(''); setBPhone(''); setBAge(''); setBGender('Male') }

  const cancelAppt = (id: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id, status: 'Cancelled' })
    addToast('info', '↻ Appointment cancelled')
  }

  /* Calendar helpers */
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 17 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

  /* List view */
  const allAppts = [...state.appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const filteredAppts = allAppts.filter(a => {
    if (listFilter.doctor && a.doctorId !== listFilter.doctor) return false
    if (listFilter.status && a.status !== listFilter.status) return false
    return true
  })

  const bookedSlots = (docId: string, date: string) =>
    state.appointments.filter(a => a.doctorId === docId && a.date === date && a.status !== 'Cancelled').map(a => a.time)

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Appointments & Booking" subtitle="Manage calendar, view bookings, and schedule new appointments"
        action={<Button onClick={() => setShowBooking(true)}><Plus size={14} /> New Booking</Button>} />

      <Tabs tabs={[{ key: 'calendar', label: '📅 Calendar View' }, { key: 'list', label: '📋 List View' }]} active={tab} onChange={setTab} />

      {tab === 'calendar' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <div className="calendar-header">
            <h4>Week of {formatDate(state.todayDate)}</h4>
          </div>
          <table className="calendar-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Time</th>
                {weekDays.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(time => (
                <tr key={time}>
                  <td className="mono text-muted" style={{ fontSize: 12 }}>{formatTime12(time)}</td>
                  {weekDays.map((_, di) => {
                    const date = `2025-07-${String(7 + di).padStart(2, '0')}`
                    const appt = state.appointments.find(a => a.date === date && a.time === time && a.status !== 'Cancelled')
                    if (appt) {
                      const p = getPatient(appt.patientId)
                      const d = getDoctor(appt.doctorId)
                      const dIdx = state.doctors.findIndex(dd => dd.id === appt.doctorId)
                      const colors = ['#6DBF8A', '#A78BFA', '#4A9EFF', '#F0B429']
                      return (
                        <td key={di}>
                          <div className="cal-slot cal-slot--booked" style={{ borderLeft: `3px solid ${colors[dIdx % 4]}` }}>
                            <span className="cal-slot__name">{p?.name?.split(' ')[0]}</span>
                            <span className="cal-slot__doc text-muted">{d?.name?.split(' ').pop()}</span>
                          </div>
                        </td>
                      )
                    }
                    return (
                      <td key={di}>
                        <div className="cal-slot cal-slot--empty" onClick={() => { setShowBooking(true) }} title="Book this slot" />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'list' && (
        <div className="card">
          <div className="filter-row">
            <select className="form-input form-input--sm" value={listFilter.doctor} onChange={e => setListFilter(f => ({ ...f, doctor: e.target.value }))}>
              <option value="">All Doctors</option>
              {state.doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="form-input form-input--sm" value={listFilter.status} onChange={e => setListFilter(f => ({ ...f, status: e.target.value }))}>
              <option value="">All Status</option>
              <option>Scheduled</option><option>Completed</option><option>Waiting</option><option>In Queue</option><option>Cancelled</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Time</th><th>Patient</th><th>Doctor</th><th>Type</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filteredAppts.map(a => {
                  const p = getPatient(a.patientId)
                  const d = getDoctor(a.doctorId)
                  return (
                    <tr key={a.id}>
                      <td>{formatDate(a.date)}</td>
                      <td className="mono">{formatTime12(a.time)}</td>
                      <td>{p?.name || '–'}</td>
                      <td>{d?.name || '–'}</td>
                      <td>{a.type}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        {a.status !== 'Completed' && a.status !== 'Cancelled' &&
                          <button className="text-btn text-btn--red" onClick={() => cancelAppt(a.id)}>Cancel</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multi-step Booking Modal */}
      <Modal isOpen={showBooking} onClose={() => { setShowBooking(false); resetForm() }} title="Book New Appointment" size="lg">
        <div className="booking-steps">
          <div className="step-indicator">
            {['Select Doctor', 'Date & Time', 'Patient', 'Confirm'].map((s, i) => (
              <div key={i} className={`step-dot ${step === i ? 'step-dot--active' : step > i ? 'step-dot--done' : ''}`}>
                <span>{i + 1}</span><label>{s}</label>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="doctor-grid">
              {state.doctors.map(d => (
                <div key={d.id} className={`doctor-pick ${bDoc === d.id ? 'doctor-pick--selected' : ''} ${!d.available ? 'doctor-pick--disabled' : ''}`}
                  onClick={() => d.available && setBDoc(d.id)}>
                  <div className="doctor-pick__avatar" style={{ background: d.available ? '#6DBF8A20' : '#F45B5B20', color: d.available ? '#6DBF8A' : '#F45B5B' }}>{d.avatar}</div>
                  <div><strong>{d.name}</strong><br /><span className="text-muted">{d.speciality} – ₹{d.fee}</span></div>
                  {!d.available && <span className="status-badge" style={{ color: '#F45B5B', background: '#F45B5B15' }}>Unavailable</span>}
                </div>
              ))}
              <div className="step-actions"><Button onClick={() => step < 3 && bDoc && setStep(1)} disabled={!bDoc}>Next →</Button></div>
            </div>
          )}

          {step === 1 && (
            <div className="form-stack">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={bDate} onChange={e => setBDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Available Slots</label>
                <div className="slot-grid">
                  {getDoctor(bDoc)?.slots.map(s => {
                    const taken = bookedSlots(bDoc, bDate).includes(s)
                    return (
                      <button key={s} className={`slot-btn ${bTime === s ? 'slot-btn--selected' : ''} ${taken ? 'slot-btn--taken' : ''}`}
                        disabled={taken} onClick={() => setBTime(s)}>
                        {formatTime12(s)}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="step-actions">
                <Button variant="ghost" onClick={() => setStep(0)}>← Back</Button>
                <Button onClick={() => bTime && setStep(2)} disabled={!bTime}>Next →</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-stack">
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" checked={bNewPatient} onChange={e => setBNewPatient(e.target.checked)} style={{ marginRight: 8 }} />
                  New Patient (not in system)
                </label>
              </div>
              {!bNewPatient ? (
                <div className="form-group">
                  <label className="form-label">Select Patient</label>
                  <select className="form-input" value={bPat} onChange={e => setBPat(e.target.value)}>
                    <option value="">Choose patient...</option>
                    {state.patients.map(p => <option key={p.id} value={p.id}>{p.name} – {p.phone}</option>)}
                  </select>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={bName} onChange={e => setBName(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={bPhone} onChange={e => setBPhone(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={bAge} onChange={e => setBAge(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Gender</label>
                      <select className="form-input" value={bGender} onChange={e => setBGender(e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select>
                    </div>
                  </div>
                </>
              )}
              <div className="step-actions">
                <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => (bPat || (bNewPatient && bName && bPhone)) && setStep(3)} disabled={!bPat && !(bNewPatient && bName && bPhone)}>Next →</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-stack">
              <div className="confirm-summary card" style={{ padding: 20 }}>
                <h4 style={{ color: '#6DBF8A', marginBottom: 12 }}>Booking Summary</h4>
                <div className="summary-row"><span className="text-muted">Doctor:</span> <strong>{getDoctor(bDoc)?.name}</strong></div>
                <div className="summary-row"><span className="text-muted">Date:</span> <strong>{formatDate(bDate)}</strong></div>
                <div className="summary-row"><span className="text-muted">Time:</span> <strong className="mono">{formatTime12(bTime)}</strong></div>
                <div className="summary-row"><span className="text-muted">Patient:</span> <strong>{bNewPatient ? bName : getPatient(bPat)?.name}</strong></div>
                <div className="summary-row"><span className="text-muted">Fee:</span> <strong>₹{getDoctor(bDoc)?.fee}</strong></div>
              </div>
              <div className="step-actions">
                <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                <Button onClick={handleBook}>✓ Confirm Booking</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

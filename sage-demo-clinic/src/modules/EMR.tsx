import { useState } from 'react'
import { Search, Plus, User, Phone, Mail, Heart, AlertTriangle, Calendar, FileText, FlaskConical, IndianRupee } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, Avatar, Tabs, EmptyState, SectionTitle } from '../ui'
import { DOCTORS } from '../data'
import { formatDate, formatINR, newId } from '../utils'

export default function EMRModule() {
  const { state, dispatch, addToast } = useApp()
  const [search, setSearch] = useState('')
  const [selId, setSelId] = useState<string | null>(state.selectedPatientId || (state.patients[0]?.id || null))
  const [tab, setTab] = useState('overview')
  const [showNewPatient, setShowNewPatient] = useState(false)
  const [showPayment, setShowPayment] = useState<string | null>(null)
  const [payAmt, setPayAmt] = useState('')
  const [payMethod, setPayMethod] = useState('UPI')

  // New patient form
  const [np, setNp] = useState({ name: '', phone: '', email: '', age: '', gender: 'Male', blood: '', address: '', allergies: '', conditions: '' })

  const filtered = state.patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.id.toLowerCase().includes(search.toLowerCase()))
  const patient = state.patients.find(p => p.id === selId)
  const getDoc = (id: string) => DOCTORS.find(d => d.id === id)

  const patientAppts = patient ? state.appointments.filter(a => a.patientId === patient.id) : []
  const patientRx = patient ? state.prescriptions.filter(r => r.patientId === patient.id) : []
  const patientLab = patient ? state.labReports.filter(l => l.patientId === patient.id) : []
  const patientInv = patient ? state.invoices.filter(i => i.patientId === patient.id) : []

  const handleNewPatient = () => {
    if (!np.name || !np.phone) return
    const newP = {
      id: newId('P', state.patients), name: np.name, age: Number(np.age) || 0, gender: np.gender,
      phone: np.phone, email: np.email, blood: np.blood, address: np.address,
      lastVisit: '', totalVisits: 0, balance: 0,
      allergies: np.allergies ? np.allergies.split(',').map(s => s.trim()) : [],
      conditions: np.conditions ? np.conditions.split(',').map(s => s.trim()) : [],
    }
    dispatch({ type: 'ADD_PATIENT', payload: newP })
    addToast('success', `✓ Patient ${newP.name} added (${newP.id})`)
    setSelId(newP.id); setShowNewPatient(false)
    setNp({ name: '', phone: '', email: '', age: '', gender: 'Male', blood: '', address: '', allergies: '', conditions: '' })
  }

  const handlePay = () => {
    if (!showPayment || !payAmt) return
    const inv = state.invoices.find(i => i.id === showPayment)
    if (!inv) return
    const newPaid = inv.paid + Number(payAmt)
    const newStatus = newPaid >= inv.total ? 'Paid' : 'Partial'
    dispatch({ type: 'UPDATE_INVOICE', id: inv.id, payload: { paid: newPaid, status: newStatus, method: payMethod } })
    addToast('success', `✓ Payment of ₹${payAmt} recorded – Balance: ₹${inv.total - newPaid}`)
    setShowPayment(null); setPayAmt('')
  }

  return (
    <div className="module-page fade-in">
      <div className="emr-layout">
        {/* Left: Patient List */}
        <div className="emr-sidebar">
          <div className="emr-search">
            <Search size={16} className="emr-search-icon" />
            <input className="form-input" placeholder="Search name, phone, ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => setShowNewPatient(true)} className="w-full" size="sm"><Plus size={14} /> New Patient</Button>
          <div className="patient-list">
            {filtered.map(p => (
              <div key={p.id} className={`patient-card ${selId === p.id ? 'patient-card--active' : ''}`} onClick={() => { setSelId(p.id); setTab('overview') }}>
                <Avatar name={p.name} size={34} />
                <div className="patient-card__info">
                  <strong>{p.name}</strong>
                  <span className="text-muted text-xs">{p.age}{p.gender[0]} · Last: {p.lastVisit ? formatDate(p.lastVisit) : 'Never'}</span>
                </div>
                <span className="patient-card__badge">{p.totalVisits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Patient Record */}
        <div className="emr-content">
          {patient ? (
            <>
              <div className="patient-header card">
                <Avatar name={patient.name} size={48} />
                <div className="patient-header__info">
                  <h3>{patient.name} <span className="mono text-muted" style={{ fontSize: 13 }}>({patient.id})</span></h3>
                  <p className="text-muted">{patient.age} yrs · {patient.gender} · Blood: {patient.blood || '–'}</p>
                </div>
                <div className="patient-header__stats">
                  <div><span className="text-muted">Visits</span><strong>{patient.totalVisits}</strong></div>
                  <div><span className="text-muted">Last Visit</span><strong>{patient.lastVisit ? formatDate(patient.lastVisit) : '–'}</strong></div>
                  <div><span className="text-muted">Balance</span><strong style={{ color: patient.balance > 0 ? '#F45B5B' : '#6DBF8A' }}>{formatINR(patient.balance)}</strong></div>
                </div>
              </div>

              {/* Allergies & Conditions */}
              {(patient.allergies.length > 0 || patient.conditions.length > 0) && (
                <div className="patient-tags">
                  {patient.allergies.map(a => <span key={a} className="tag tag--red"><AlertTriangle size={12} /> {a}</span>)}
                  {patient.conditions.map(c => <span key={c} className="tag tag--amber">{c}</span>)}
                </div>
              )}

              <Tabs tabs={[
                { key: 'overview', label: 'Overview' },
                { key: 'visits', label: 'Visit History' },
                { key: 'prescriptions', label: 'Prescriptions' },
                { key: 'lab', label: 'Lab Reports' },
                { key: 'billing', label: 'Billing' },
              ]} active={tab} onChange={setTab} />

              {tab === 'overview' && (
                <div className="card" style={{ padding: 20 }}>
                  <h4 className="card-title">Contact Information</h4>
                  <div className="info-grid">
                    <div><Phone size={14} /> {patient.phone}</div>
                    <div><Mail size={14} /> {patient.email || '–'}</div>
                    <div><User size={14} /> {patient.address || '–'}</div>
                    <div><Heart size={14} /> Blood Group: {patient.blood || '–'}</div>
                  </div>
                </div>
              )}

              {tab === 'visits' && (
                <div className="card">
                  {patientAppts.length === 0 ? <EmptyState icon={Calendar} title="No visits yet" subtitle="Schedule this patient's first appointment" /> : (
                    <div className="visit-timeline">
                      {patientAppts.sort((a, b) => b.date.localeCompare(a.date)).map(a => {
                        const rx = state.prescriptions.find(r => r.appointmentId === a.id)
                        return (
                          <div key={a.id} className="visit-item">
                            <div className="visit-item__date">{formatDate(a.date)}</div>
                            <div className="visit-item__info">
                              <strong>{getDoc(a.doctorId)?.name}</strong> · {a.type}
                              {rx && <p className="text-muted">{rx.diagnosis}</p>}
                            </div>
                            <StatusBadge status={a.status} />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {tab === 'prescriptions' && (
                <div className="rx-list">
                  {patientRx.length === 0 ? <div className="card"><EmptyState icon={FileText} title="No prescriptions" subtitle="Prescriptions from consultations will appear here" /></div> :
                    patientRx.map(rx => (
                      <div key={rx.id} className="card rx-card">
                        <div className="rx-card__header">
                          <div><strong>{rx.diagnosis}</strong><br /><span className="text-muted">{formatDate(rx.date)} · {getDoc(rx.doctorId)?.name}</span></div>
                        </div>
                        <div className="rx-vitals">
                          <span>BP: {rx.vitals.bp}</span><span>Pulse: {rx.vitals.pulse}</span>
                          <span>Wt: {rx.vitals.weight}</span><span>SpO₂: {rx.vitals.spo2}</span>
                        </div>
                        <table className="data-table data-table--compact">
                          <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
                          <tbody>
                            {rx.medicines.map((m, i) => (
                              <tr key={i}><td>{m.name}</td><td>{m.dose}</td><td>{m.freq}</td><td>{m.duration}</td><td>{m.instructions}</td></tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-muted" style={{ marginTop: 8 }}>Advice: {rx.advice}</p>
                        <p className="text-muted">Follow-up: {formatDate(rx.followUp)}</p>
                      </div>
                    ))}
                </div>
              )}

              {tab === 'lab' && (
                <div className="rx-list">
                  {patientLab.length === 0 ? <div className="card"><EmptyState icon={FlaskConical} title="No lab reports" subtitle="Lab orders and reports will appear here" /></div> :
                    patientLab.map(l => (
                      <div key={l.id} className="card rx-card">
                        <div className="rx-card__header">
                          <div><strong>{l.testName}</strong><br /><span className="text-muted">{formatDate(l.date)} · {l.lab}</span></div>
                          <StatusBadge status={l.status} />
                        </div>
                        {l.results.length > 0 && (
                          <table className="data-table data-table--compact">
                            <thead><tr><th>Parameter</th><th>Value</th><th>Range</th><th>Flag</th></tr></thead>
                            <tbody>
                              {l.results.map((r, i) => (
                                <tr key={i}>
                                  <td>{r.name}</td><td className="mono">{r.value}</td><td className="text-muted">{r.range}</td>
                                  <td><span style={{ color: r.flag === 'Normal' ? '#6DBF8A' : r.flag === 'High' ? '#F45B5B' : '#F0B429', fontWeight: 600, fontSize: 12 }}>{r.flag}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {tab === 'billing' && (
                <div className="card">
                  {patientInv.length === 0 ? <EmptyState icon={IndianRupee} title="No invoices" subtitle="Billing records will appear here" /> : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Invoice #</th><th>Date</th><th>Items</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                          {patientInv.map(inv => (
                            <tr key={inv.id}>
                              <td className="mono">{inv.id}</td>
                              <td>{formatDate(inv.date)}</td>
                              <td>{inv.items.map(it => it.name).join(', ')}</td>
                              <td className="mono">{formatINR(inv.total)}</td>
                              <td className="mono">{formatINR(inv.paid)}</td>
                              <td className="mono" style={{ color: inv.total - inv.paid > 0 ? '#F45B5B' : '#6DBF8A' }}>{formatINR(inv.total - inv.paid)}</td>
                              <td><StatusBadge status={inv.status} /></td>
                              <td>{inv.status !== 'Paid' && <button className="text-btn" onClick={() => { setShowPayment(inv.id); setPayAmt(String(inv.total - inv.paid)) }}>Pay Now</button>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="card"><EmptyState icon={User} title="Select a patient" subtitle="Choose a patient from the list to view their records" /></div>
          )}
        </div>
      </div>

      {/* New Patient Modal */}
      <Modal isOpen={showNewPatient} onClose={() => setShowNewPatient(false)} title="Register New Patient" size="lg">
        <div className="form-stack">
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={np.name} onChange={e => setNp(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={np.phone} onChange={e => setNp(p => ({ ...p, phone: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={np.email} onChange={e => setNp(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={np.age} onChange={e => setNp(p => ({ ...p, age: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Gender</label>
              <select className="form-input" value={np.gender} onChange={e => setNp(p => ({ ...p, gender: e.target.value }))}><option>Male</option><option>Female</option><option>Other</option></select>
            </div>
            <div className="form-group"><label className="form-label">Blood Group</label><input className="form-input" value={np.blood} onChange={e => setNp(p => ({ ...p, blood: e.target.value }))} placeholder="e.g. B+" /></div>
          </div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={np.address} onChange={e => setNp(p => ({ ...p, address: e.target.value }))} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Allergies (comma separated)</label><input className="form-input" value={np.allergies} onChange={e => setNp(p => ({ ...p, allergies: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Conditions (comma separated)</label><input className="form-input" value={np.conditions} onChange={e => setNp(p => ({ ...p, conditions: e.target.value }))} /></div>
          </div>
          <Button onClick={handleNewPatient} disabled={!np.name || !np.phone} className="w-full">Register Patient</Button>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={!!showPayment} onClose={() => setShowPayment(null)} title="Record Payment" size="sm">
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Method</label>
            <select className="form-input" value={payMethod} onChange={e => setPayMethod(e.target.value)}><option>Cash</option><option>Card</option><option>UPI</option></select>
          </div>
          <Button onClick={handlePay} className="w-full">Mark as Paid</Button>
        </div>
      </Modal>
    </div>
  )
}

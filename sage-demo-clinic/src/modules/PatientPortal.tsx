import { useState } from 'react'
import { Home, Calendar, FileText, FlaskConical, IndianRupee, User, Edit, Save } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, Avatar, Tabs, EmptyState, SectionTitle } from '../ui'
import { DOCTORS } from '../data'
import { formatDate, formatINR, formatTime12 } from '../utils'

export default function PatientPortal() {
  const { state, dispatch, addToast } = useApp()
  const [section, setSection] = useState('home')
  const patient = state.patients.find(p => p.id === 'P001')! // Rahul Verma

  const myAppts = state.appointments.filter(a => a.patientId === 'P001')
  const upcoming = myAppts.filter(a => a.date >= state.todayDate && a.status === 'Scheduled')
  const past = myAppts.filter(a => a.status === 'Completed')
  const myRx = state.prescriptions.filter(r => r.patientId === 'P001')
  const myLab = state.labReports.filter(l => l.patientId === 'P001')
  const myInv = state.invoices.filter(i => i.patientId === 'P001')
  const getDoc = (id: string) => DOCTORS.find(d => d.id === id)

  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(patient.phone)
  const [email, setEmail] = useState(patient.email)
  const [address, setAddress] = useState(patient.address)

  const saveProfile = () => {
    dispatch({ type: 'UPDATE_PATIENT', payload: { ...patient, phone, email, address } })
    addToast('success', '✓ Profile updated')
    setEditing(false)
  }

  const [showRx, setShowRx] = useState<string | null>(null)
  const rxDetail = state.prescriptions.find(r => r.id === showRx)

  const navItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'appointments', label: 'My Appointments', icon: Calendar },
    { key: 'prescriptions', label: 'My Prescriptions', icon: FileText },
    { key: 'reports', label: 'My Reports', icon: FlaskConical },
    { key: 'bills', label: 'My Bills', icon: IndianRupee },
    { key: 'profile', label: 'My Profile', icon: User },
  ]

  return (
    <div className="portal-theme module-page fade-in">
      {/* Portal Nav */}
      <div className="portal-nav">
        {navItems.map(n => (
          <button key={n.key} className={`portal-nav-btn ${section === n.key ? 'portal-nav-btn--active' : ''}`} onClick={() => setSection(n.key)}>
            <n.icon size={16} /> {n.label}
          </button>
        ))}
      </div>

      {section === 'home' && (
        <div>
          <div className="portal-greeting card">
            <h2>Welcome back, {patient.name.split(' ')[0]} 👋</h2>
            <p className="text-muted">Here's your health dashboard</p>
          </div>
          {upcoming.length > 0 && (
            <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #6DBF8A' }}>
              <h4 className="card-title">Upcoming Appointment</h4>
              {upcoming.slice(0, 1).map(a => (
                <div key={a.id}>
                  <p><strong>{getDoc(a.doctorId)?.name}</strong> · {formatDate(a.date)} at {formatTime12(a.time)}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button size="sm" onClick={() => addToast('info', '📅 Added to calendar')}>Add to Calendar</Button>
                    <Button size="sm" variant="danger" onClick={() => { dispatch({ type: 'UPDATE_APPT_STATUS', id: a.id, status: 'Cancelled' }); addToast('info', '↻ Appointment cancelled') }}>Cancel</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="portal-quick-links">
            <button className="portal-quick-btn" onClick={() => setSection('appointments')}><Calendar size={20} /><span>Book Appointment</span></button>
            <button className="portal-quick-btn" onClick={() => setSection('prescriptions')}><FileText size={20} /><span>View Prescriptions</span></button>
            <button className="portal-quick-btn" onClick={() => setSection('reports')}><FlaskConical size={20} /><span>My Reports</span></button>
          </div>
        </div>
      )}

      {section === 'appointments' && (
        <div>
          <SectionTitle title="My Appointments" />
          <h4 className="card-title" style={{ marginBottom: 8 }}>Upcoming</h4>
          {upcoming.length === 0 ? <div className="card"><EmptyState icon={Calendar} title="No upcoming appointments" subtitle="Book your next visit" /></div> :
            upcoming.map(a => (
              <div key={a.id} className="card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>{getDoc(a.doctorId)?.name}</strong><br /><span className="text-muted">{formatDate(a.date)} · {formatTime12(a.time)}</span></div>
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          <h4 className="card-title" style={{ margin: '16px 0 8px' }}>Past Visits</h4>
          {past.map(a => (
            <div key={a.id} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{getDoc(a.doctorId)?.name}</strong><br /><span className="text-muted">{formatDate(a.date)}</span></div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'prescriptions' && (
        <div>
          <SectionTitle title="My Prescriptions" />
          {myRx.length === 0 ? <div className="card"><EmptyState icon={FileText} title="No prescriptions" subtitle="Your prescriptions will appear here" /></div> :
            myRx.map(rx => (
              <div key={rx.id} className="card" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => setShowRx(rx.id)}>
                <strong>{rx.diagnosis}</strong>
                <br /><span className="text-muted">{formatDate(rx.date)} · {getDoc(rx.doctorId)?.name} · {rx.medicines.length} medicine(s)</span>
              </div>
            ))}
        </div>
      )}

      {section === 'reports' && (
        <div>
          <SectionTitle title="My Reports" />
          {myLab.length === 0 ? <div className="card"><EmptyState icon={FlaskConical} title="No lab reports" subtitle="Lab results will appear here" /></div> :
            myLab.map(l => (
              <div key={l.id} className="card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{l.testName}</strong><br /><span className="text-muted">{formatDate(l.date)} · {l.lab}</span></div>
                  <StatusBadge status={l.status} />
                </div>
                {l.results.length > 0 && (
                  <table className="data-table data-table--compact portal-table" style={{ marginTop: 8 }}>
                    <thead><tr><th>Parameter</th><th>Value</th><th>Range</th><th>Flag</th></tr></thead>
                    <tbody>{l.results.map((r, i) => (
                      <tr key={i}><td>{r.name}</td><td className="mono">{r.value}</td><td className="text-muted">{r.range}</td>
                        <td><span style={{ color: r.flag === 'Normal' ? '#0E7C6B' : '#E53E3E', fontWeight: 600, fontSize: 12 }}>{r.flag}</span></td></tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            ))}
        </div>
      )}

      {section === 'bills' && (
        <div>
          <SectionTitle title="My Bills" />
          {myInv.length === 0 ? <div className="card"><EmptyState icon={IndianRupee} title="No bills" subtitle="Your invoices will appear here" /></div> :
            myInv.map(inv => (
              <div key={inv.id} className="card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong className="mono">{inv.id}</strong> · {formatDate(inv.date)}
                    <br /><span className="text-muted">{inv.items.map(it => it.name).join(', ')}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="mono">{formatINR(inv.total)}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
                {inv.status !== 'Paid' && (
                  <Button size="sm" style={{ marginTop: 8 }} onClick={() => { dispatch({ type: 'UPDATE_INVOICE', id: inv.id, payload: { paid: inv.total, status: 'Paid' } }); addToast('success', '✓ Payment recorded') }}>Pay Now – {formatINR(inv.total - inv.paid)}</Button>
                )}
              </div>
            ))}
        </div>
      )}

      {section === 'profile' && (
        <div>
          <SectionTitle title="My Profile" action={!editing ? <Button size="sm" variant="secondary" onClick={() => setEditing(true)}><Edit size={14} /> Edit</Button> : undefined} />
          <div className="card">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <Avatar name={patient.name} size={56} />
              <div><h3>{patient.name}</h3><p className="text-muted">{patient.age} yrs · {patient.gender} · Blood: {patient.blood}</p></div>
            </div>
            <div className="form-stack">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} disabled={!editing} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={email} onChange={e => setEmail(e.target.value)} disabled={!editing} /></div>
              <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={address} onChange={e => setAddress(e.target.value)} disabled={!editing} /></div>
              <div className="form-group"><label className="form-label">Allergies</label><div className="patient-tags">{patient.allergies.map(a => <span key={a} className="tag tag--red">{a}</span>)}{patient.allergies.length === 0 && <span className="text-muted">None</span>}</div></div>
              <div className="form-group"><label className="form-label">Conditions</label><div className="patient-tags">{patient.conditions.map(c => <span key={c} className="tag tag--amber">{c}</span>)}{patient.conditions.length === 0 && <span className="text-muted">None</span>}</div></div>
              {editing && <Button onClick={saveProfile}><Save size={14} /> Save Changes</Button>}
            </div>
          </div>
        </div>
      )}

      {/* Rx Detail Modal */}
      <Modal isOpen={!!showRx} onClose={() => setShowRx(null)} title="Prescription Detail" size="md">
        {rxDetail && (
          <div className="rx-print portal-rx">
            <div className="rx-print__section"><strong>Dx:</strong> {rxDetail.diagnosis}</div>
            <div className="rx-print__section"><strong>Vitals:</strong> BP {rxDetail.vitals.bp} | Pulse {rxDetail.vitals.pulse} | Wt {rxDetail.vitals.weight}</div>
            <div className="rx-print__section">
              <h4>℞</h4>
              {rxDetail.medicines.map((m, i) => (
                <div key={i} className="rx-print__med"><span className="mono">{i + 1}.</span><div><strong>{m.name}</strong> – {m.dose} {m.freq}<br /><span className="text-muted">{m.instructions} · {m.duration}</span></div></div>
              ))}
            </div>
            <div className="rx-print__section"><strong>Advice:</strong> {rxDetail.advice}</div>
            <div className="rx-print__section"><strong>Follow-up:</strong> {formatDate(rxDetail.followUp)}</div>
          </div>
        )}
      </Modal>
    </div>
  )
}

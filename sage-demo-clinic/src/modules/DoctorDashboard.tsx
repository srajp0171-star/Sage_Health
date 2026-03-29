import { useState } from 'react'
import { Clock, Check, FileText, FlaskConical, Eye, Plus, Trash2 } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, Avatar, SectionTitle, EmptyState } from '../ui'
import { DOCTORS } from '../data'
import { formatTime12, isToday, newId, formatDate } from '../utils'

export default function DoctorDashboard() {
  const { state, dispatch, addToast } = useApp()
  const [showRx, setShowRx] = useState(false)
  const [showLab, setShowLab] = useState(false)
  const [rxPatientId, setRxPatientId] = useState('')

  const doctor = DOCTORS.find(d => d.id === 'D001')!
  const myAppts = state.appointments.filter(a => a.doctorId === 'D001' && isToday(a.date)).sort((a, b) => a.time.localeCompare(b.time))
  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const completed = myAppts.filter(a => a.status === 'Completed').length

  // Prescription form state
  const [rxDiag, setRxDiag] = useState('')
  const [rxBp, setRxBp] = useState('')
  const [rxPulse, setRxPulse] = useState('')
  const [rxWeight, setRxWeight] = useState('')
  const [rxSpo2, setRxSpo2] = useState('')
  const [rxMeds, setRxMeds] = useState([{ name: '', dose: '', freq: 'Once daily', duration: '30 days', instructions: '' }])
  const [rxAdvice, setRxAdvice] = useState('')
  const [rxFollowUp, setRxFollowUp] = useState('')

  // Lab order state
  const [labPatId, setLabPatId] = useState('')
  const [labTest, setLabTest] = useState('')
  const [labLab, setLabLab] = useState('')
  const [labPriority, setLabPriority] = useState('Routine')

  const addMedRow = () => setRxMeds(m => [...m, { name: '', dose: '', freq: 'Once daily', duration: '30 days', instructions: '' }])
  const removeMedRow = (i: number) => setRxMeds(m => m.filter((_, idx) => idx !== i))
  const updateMed = (i: number, key: string, val: string) => setRxMeds(m => m.map((med, idx) => idx === i ? { ...med, [key]: val } : med))

  const startConsult = (id: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id, status: 'In Queue' })
    addToast('info', '↻ Patient called — consultation started')
  }

  const completeConsult = (apptId: string, patientId: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id: apptId, status: 'Completed' })
    setRxPatientId(patientId)
    setShowRx(true)
    addToast('success', '✓ Consultation completed')
  }

  const saveRx = () => {
    if (!rxDiag || rxMeds.every(m => !m.name)) return
    const rx = {
      id: newId('RX', state.prescriptions), patientId: rxPatientId, doctorId: 'D001', date: state.todayDate,
      appointmentId: myAppts.find(a => a.patientId === rxPatientId && a.status === 'Completed')?.id || null,
      diagnosis: rxDiag,
      medicines: rxMeds.filter(m => m.name),
      advice: rxAdvice, followUp: rxFollowUp,
      vitals: { bp: rxBp, pulse: rxPulse, weight: rxWeight, spo2: rxSpo2 },
    }
    dispatch({ type: 'SAVE_PRESCRIPTION', payload: rx })
    addToast('success', '✓ Prescription saved and sent to patient portal')
    setShowRx(false)
    setRxDiag(''); setRxBp(''); setRxPulse(''); setRxWeight(''); setRxSpo2('')
    setRxMeds([{ name: '', dose: '', freq: 'Once daily', duration: '30 days', instructions: '' }])
    setRxAdvice(''); setRxFollowUp('')
  }

  const orderLab = () => {
    if (!labPatId || !labTest) return
    const report = {
      id: newId('LAB', state.labReports), patientId: labPatId, doctorId: 'D001', date: state.todayDate,
      testName: labTest, lab: labLab || 'In-house', status: 'Pending', results: [],
    }
    dispatch({ type: 'ADD_LAB_REPORT', payload: report })
    addToast('success', `✓ Lab test ordered: ${labTest}`)
    setShowLab(false); setLabPatId(''); setLabTest(''); setLabLab('')
  }

  return (
    <div className="module-page fade-in">
      {/* Greeting */}
      <div className="card greeting-bar">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Good morning, {doctor.name}</h2>
          <p className="text-muted">You have {myAppts.length} patients today · {completed} completed</p>
        </div>
        <div className="greeting-actions">
          <Button onClick={() => setShowRx(true)} size="sm"><FileText size={14} /> Write Prescription</Button>
          <Button onClick={() => setShowLab(true)} variant="secondary" size="sm"><FlaskConical size={14} /> Order Lab Test</Button>
        </div>
      </div>

      {/* Queue */}
      <div className="queue-grid">
        {myAppts.map((a, i) => {
          const p = getPatient(a.patientId)
          const isCurrent = a.status === 'In Queue'
          return (
            <div key={a.id} className={`queue-card ${isCurrent ? 'queue-card--current' : ''} ${a.status === 'Completed' ? 'queue-card--done' : ''}`}>
              <div className="queue-card__token mono">T-{String(i + 1).padStart(2, '0')}</div>
              <div className="queue-card__info">
                <strong>{p?.name || '–'}</strong>
                <span className="text-muted text-xs">{p?.age}{p?.gender?.[0]} · {a.type}</span>
              </div>
              <span className="queue-card__time mono">{formatTime12(a.time)}</span>
              <StatusBadge status={a.status} />
              <div className="queue-card__actions">
                {a.status === 'Scheduled' && <Button size="sm" variant="secondary" onClick={() => startConsult(a.id)}><Clock size={14} /> Call</Button>}
                {a.status === 'Waiting' && <Button size="sm" variant="secondary" onClick={() => startConsult(a.id)}><Clock size={14} /> Start</Button>}
                {a.status === 'In Queue' && <Button size="sm" onClick={() => completeConsult(a.id, a.patientId)}><Check size={14} /> Complete</Button>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Prescription Modal */}
      <Modal isOpen={showRx} onClose={() => setShowRx(false)} title="Write Prescription" size="xl">
        <div className="form-stack">
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select className="form-input" value={rxPatientId} onChange={e => setRxPatientId(e.target.value)}>
              <option value="">Select patient...</option>
              {state.patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Diagnosis</label><input className="form-input" value={rxDiag} onChange={e => setRxDiag(e.target.value)} placeholder="e.g. Hypertension – Controlled" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">BP</label><input className="form-input" value={rxBp} onChange={e => setRxBp(e.target.value)} placeholder="120/80" /></div>
            <div className="form-group"><label className="form-label">Pulse</label><input className="form-input" value={rxPulse} onChange={e => setRxPulse(e.target.value)} placeholder="74" /></div>
            <div className="form-group"><label className="form-label">Weight</label><input className="form-input" value={rxWeight} onChange={e => setRxWeight(e.target.value)} placeholder="70kg" /></div>
            <div className="form-group"><label className="form-label">SpO₂</label><input className="form-input" value={rxSpo2} onChange={e => setRxSpo2(e.target.value)} placeholder="98%" /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Medicines</label>
            {rxMeds.map((m, i) => (
              <div key={i} className="med-row">
                <input className="form-input" placeholder="Medicine name" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                <input className="form-input form-input--sm" placeholder="Dose" value={m.dose} onChange={e => updateMed(i, 'dose', e.target.value)} style={{ width: 100 }} />
                <select className="form-input form-input--sm" value={m.freq} onChange={e => updateMed(i, 'freq', e.target.value)} style={{ width: 130 }}>
                  <option>Once daily</option><option>Twice daily</option><option>Thrice daily</option><option>Once weekly</option><option>As needed</option>
                </select>
                <input className="form-input form-input--sm" placeholder="Duration" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} style={{ width: 100 }} />
                <input className="form-input form-input--sm" placeholder="Instructions" value={m.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} />
                {rxMeds.length > 1 && <button className="icon-btn icon-btn--red" onClick={() => removeMedRow(i)}><Trash2 size={14} /></button>}
              </div>
            ))}
            <button className="text-btn" onClick={addMedRow}><Plus size={14} /> Add Medicine</button>
          </div>
          <div className="form-group"><label className="form-label">Advice</label><textarea className="form-input" rows={2} value={rxAdvice} onChange={e => setRxAdvice(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Follow-up Date</label><input className="form-input" type="date" value={rxFollowUp} onChange={e => setRxFollowUp(e.target.value)} /></div>
          <Button onClick={saveRx} className="w-full">Save Prescription</Button>
        </div>
      </Modal>

      {/* Lab Order Modal */}
      <Modal isOpen={showLab} onClose={() => setShowLab(false)} title="Order Lab Test" size="md">
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Patient</label>
            <select className="form-input" value={labPatId} onChange={e => setLabPatId(e.target.value)}>
              <option value="">Select patient...</option>
              {state.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Test Name</label>
            <select className="form-input" value={labTest} onChange={e => setLabTest(e.target.value)}>
              <option value="">Select test...</option>
              {['CBC', 'LFT', 'KFT', 'HbA1c', 'Lipid Profile', 'Thyroid Profile', 'Urine Routine', 'X-Ray', 'ECG', 'Ultrasound'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Lab</label><input className="form-input" value={labLab} onChange={e => setLabLab(e.target.value)} placeholder="e.g. Thyrocare" /></div>
            <div className="form-group"><label className="form-label">Priority</label>
              <select className="form-input" value={labPriority} onChange={e => setLabPriority(e.target.value)}><option>Routine</option><option>Urgent</option></select>
            </div>
          </div>
          <Button onClick={orderLab} className="w-full">Send Order</Button>
        </div>
      </Modal>
    </div>
  )
}

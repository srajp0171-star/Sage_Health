import { useState } from 'react'
import { Search, FileText, Printer, Send } from 'lucide-react'
import { useApp, Button, Modal, SectionTitle, Tabs, EmptyState } from '../ui'
import { DOCTORS, CLINIC } from '../data'
import { formatDate } from '../utils'

export default function PrescriptionModule() {
  const { state, addToast } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showRx, setShowRx] = useState<string | null>(null)

  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const getDoctor = (id: string) => DOCTORS.find(d => d.id === id)

  const filtered = state.prescriptions.filter(rx => {
    const p = getPatient(rx.patientId)
    if (search && !p?.name.toLowerCase().includes(search.toLowerCase()) && !rx.diagnosis.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === '7days') {
      const d = new Date(rx.date); const t = new Date(state.todayDate)
      if ((t.getTime() - d.getTime()) / 86400000 > 7) return false
    }
    if (filter === '30days') {
      const d = new Date(rx.date); const t = new Date(state.todayDate)
      if ((t.getTime() - d.getTime()) / 86400000 > 30) return false
    }
    return true
  })

  const detail = state.prescriptions.find(r => r.id === showRx)

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Digital Prescriptions" subtitle={`${state.prescriptions.length} prescriptions on record`} />
      <div className="filter-row" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#8896B0' }} />
          <input className="form-input" style={{ paddingLeft: 32 }} placeholder="Search by patient or diagnosis..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs tabs={[{ key: 'all', label: 'All' }, { key: '7days', label: 'Last 7 Days' }, { key: '30days', label: 'Last 30 Days' }]} active={filter} onChange={setFilter} />
      </div>
      <div className="rx-list">
        {filtered.length === 0 ? <div className="card"><EmptyState icon={FileText} title="No prescriptions found" subtitle="Try a different search or filter" /></div> :
          filtered.map(rx => {
            const p = getPatient(rx.patientId)
            return (
              <div key={rx.id} className="card rx-card" style={{ cursor: 'pointer' }} onClick={() => setShowRx(rx.id)}>
                <div className="rx-card__header">
                  <div><strong>{p?.name || '–'}</strong> · <span className="text-muted">{rx.diagnosis}</span></div>
                  <span className="text-muted text-xs">{formatDate(rx.date)} · {getDoctor(rx.doctorId)?.name}</span>
                </div>
                <p className="text-muted text-xs">{rx.medicines.length} medicine(s) · Follow-up: {formatDate(rx.followUp)}</p>
              </div>
            )
          })}
      </div>

      {/* Full Prescription View */}
      <Modal isOpen={!!showRx} onClose={() => setShowRx(null)} title="Prescription" size="lg">
        {detail && (
          <div className="rx-print">
            <div className="rx-print__header">
              <h3>{state.clinicName}</h3>
              <p>{getDoctor(detail.doctorId)?.name} — {getDoctor(detail.doctorId)?.speciality}</p>
              <p className="text-muted">{CLINIC.address}</p>
            </div>
            <div className="rx-print__patient">
              <span>Patient: <strong>{getPatient(detail.patientId)?.name}</strong> ({getPatient(detail.patientId)?.age}{getPatient(detail.patientId)?.gender?.[0]})</span>
              <span>Date: <strong>{formatDate(detail.date)}</strong></span>
              <span>UHID: <strong className="mono">{detail.patientId}</strong></span>
            </div>
            <div className="rx-print__section">
              <strong>Dx:</strong> {detail.diagnosis}
            </div>
            <div className="rx-print__section">
              <strong>Vitals:</strong> BP {detail.vitals.bp} | Pulse {detail.vitals.pulse} | Wt {detail.vitals.weight} | SpO₂ {detail.vitals.spo2}
            </div>
            <div className="rx-print__section">
              <h4 style={{ color: '#6DBF8A', marginBottom: 8 }}>℞</h4>
              {detail.medicines.map((m, i) => (
                <div key={i} className="rx-print__med">
                  <span className="mono" style={{ color: '#6DBF8A' }}>{i + 1}.</span>
                  <div>
                    <strong>{m.name}</strong> — {m.dose} {m.freq}
                    <br /><span className="text-muted">{m.instructions} · {m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rx-print__section">
              <strong>Advice:</strong> {detail.advice}
            </div>
            <div className="rx-print__section">
              <strong>Follow-up:</strong> {formatDate(detail.followUp)}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button size="sm" onClick={() => addToast('info', '📄 PDF downloading...')}><Printer size={14} /> Print</Button>
              <Button size="sm" variant="secondary" onClick={() => addToast('success', '✓ Prescription sent to patient portal')}><Send size={14} /> Send to Patient</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { FlaskConical, Plus, Upload, Share2, Eye } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, SectionTitle, EmptyState } from '../ui'
import { DOCTORS } from '../data'
import { formatDate, newId } from '../utils'

export default function LabModule() {
  const { state, dispatch, addToast } = useApp()
  const [showOrder, setShowOrder] = useState(false)
  const [showReport, setShowReport] = useState<string | null>(null)
  const [labPat, setLabPat] = useState('')
  const [labTest, setLabTest] = useState('')
  const [labLab, setLabLab] = useState('')

  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const getDoctor = (id: string) => DOCTORS.find(d => d.id === id)
  const pending = state.labReports.filter(l => l.status === 'Pending')
  const ready = state.labReports.filter(l => l.status === 'Report Ready')
  const detail = state.labReports.find(l => l.id === showReport)

  const handleUpload = (id: string) => {
    dispatch({ type: 'UPDATE_LAB_STATUS', id, status: 'Report Ready' })
    addToast('success', '✓ Report uploaded and shared with patient')
  }

  const orderTest = () => {
    if (!labPat || !labTest) return
    const report = { id: newId('LAB', state.labReports), patientId: labPat, doctorId: 'D001', date: state.todayDate, testName: labTest, lab: labLab || 'In-house', status: 'Pending', results: [] }
    dispatch({ type: 'ADD_LAB_REPORT', payload: report })
    addToast('success', `✓ Lab test ordered: ${labTest}`)
    setShowOrder(false); setLabPat(''); setLabTest(''); setLabLab('')
  }

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Lab Orders & Reports" action={<Button onClick={() => setShowOrder(true)}><Plus size={14} /> New Lab Order</Button>} />
      <div className="lab-layout">
        <div>
          <h4 className="card-title" style={{ marginBottom: 12 }}>📋 Pending Orders ({pending.length})</h4>
          {pending.length === 0 ? <div className="card"><EmptyState icon={FlaskConical} title="No pending orders" subtitle="All lab tests are up to date" /></div> :
            pending.map(l => (
              <div key={l.id} className="card lab-card">
                <div className="lab-card__info">
                  <strong>{getPatient(l.patientId)?.name}</strong>
                  <span className="text-muted">{l.testName} · {l.lab}</span>
                  <span className="text-muted text-xs">{formatDate(l.date)} · {getDoctor(l.doctorId)?.name}</span>
                </div>
                <Button size="sm" onClick={() => handleUpload(l.id)}><Upload size={14} /> Upload Report</Button>
              </div>
            ))}
        </div>
        <div>
          <h4 className="card-title" style={{ marginBottom: 12 }}>✅ Reports Ready ({ready.length})</h4>
          {ready.length === 0 ? <div className="card"><EmptyState icon={FlaskConical} title="No reports yet" subtitle="Completed lab results will appear here" /></div> :
            ready.map(l => (
              <div key={l.id} className="card lab-card">
                <div className="lab-card__info">
                  <strong>{getPatient(l.patientId)?.name}</strong>
                  <span className="text-muted">{l.testName} · {l.lab}</span>
                  <span className="text-muted text-xs">{formatDate(l.date)}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="secondary" onClick={() => setShowReport(l.id)}><Eye size={14} /> View</Button>
                  <Button size="sm" variant="ghost" onClick={() => addToast('success', '✓ Report shared to patient portal')}><Share2 size={14} /></Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* View Report Modal */}
      <Modal isOpen={!!showReport} onClose={() => setShowReport(null)} title={detail?.testName || 'Lab Report'} size="md">
        {detail && (
          <div>
            <div className="summary-row"><span>Patient:</span><strong>{getPatient(detail.patientId)?.name}</strong></div>
            <div className="summary-row"><span>Date:</span><strong>{formatDate(detail.date)}</strong></div>
            <div className="summary-row"><span>Lab:</span><strong>{detail.lab}</strong></div>
            {detail.results.length > 0 ? (
              <table className="data-table data-table--compact" style={{ marginTop: 12 }}>
                <thead><tr><th>Parameter</th><th>Value</th><th>Range</th><th>Flag</th></tr></thead>
                <tbody>
                  {detail.results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td><td className="mono">{r.value}</td><td className="text-muted">{r.range}</td>
                      <td><span style={{ color: r.flag === 'Normal' ? '#6DBF8A' : '#F45B5B', fontWeight: 600, fontSize: 12 }}>{r.flag}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-muted" style={{ marginTop: 12 }}>Detailed results will be available once the lab processes the sample.</p>}
          </div>
        )}
      </Modal>

      {/* New Order Modal */}
      <Modal isOpen={showOrder} onClose={() => setShowOrder(false)} title="Order Lab Test" size="md">
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Patient</label>
            <select className="form-input" value={labPat} onChange={e => setLabPat(e.target.value)}>
              <option value="">Select patient...</option>
              {state.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Test</label>
            <select className="form-input" value={labTest} onChange={e => setLabTest(e.target.value)}>
              <option value="">Select test...</option>
              {['CBC', 'LFT', 'KFT', 'HbA1c', 'Lipid Profile', 'Thyroid Profile', 'Urine Routine', 'X-Ray', 'ECG', 'Ultrasound'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Lab</label><input className="form-input" value={labLab} onChange={e => setLabLab(e.target.value)} placeholder="e.g. Thyrocare" /></div>
          <Button onClick={orderTest} className="w-full">Send Order</Button>
        </div>
      </Modal>
    </div>
  )
}

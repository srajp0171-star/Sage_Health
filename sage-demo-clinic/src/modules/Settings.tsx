import { useState } from 'react'
import { Save, Plus, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { useApp, Button, Modal, SectionTitle, Tabs } from '../ui'
import { CLINIC } from '../data'

export default function SettingsModule() {
  const { state, dispatch, addToast } = useApp()
  const [tab, setTab] = useState('clinic')
  const [clinicName, setClinicName] = useState(state.clinicName)
  const [clinicTagline, setClinicTagline] = useState(state.clinicTagline)
  const [address, setAddress] = useState(CLINIC.address)

  const [showAddDoc, setShowAddDoc] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: '', speciality: '', fee: '' })
  const [showAddSvc, setShowAddSvc] = useState(false)
  const [newSvc, setNewSvc] = useState({ name: '', price: '', category: 'Consultation' })

  const saveClinic = () => {
    dispatch({ type: 'SET_CLINIC_NAME', name: clinicName })
    dispatch({ type: 'SET_CLINIC_TAGLINE', tagline: clinicTagline })
    addToast('success', '✓ Clinic profile updated')
  }

  const staffUsers = [
    { name: 'Admin User', role: 'Administrator', email: 'admin@lifecareclinic.in' },
    { name: 'Reception Staff', role: 'Receptionist', email: 'reception@lifecareclinic.in' },
    { name: 'Dr. Arjun Mehta', role: 'Doctor', email: 'arjun.m@lifecareclinic.in' },
  ]

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Settings" subtitle="Manage clinic configuration" />
      <Tabs tabs={[
        { key: 'clinic', label: 'Clinic Profile' },
        { key: 'doctors', label: 'Doctors' },
        { key: 'services', label: 'Services' },
        { key: 'users', label: 'Users' },
      ]} active={tab} onChange={setTab} />

      {tab === 'clinic' && (
        <div className="card">
          <div className="form-stack">
            <div className="form-group"><label className="form-label">Clinic Name</label><input className="form-input" value={clinicName} onChange={e => setClinicName(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Tagline</label><input className="form-input" value={clinicTagline} onChange={e => setClinicTagline(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={address} onChange={e => setAddress(e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={CLINIC.phone} disabled /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={CLINIC.email} disabled /></div>
            </div>
            <div className="form-group"><label className="form-label">GSTIN</label><input className="form-input mono" value={CLINIC.gstin} disabled /></div>
            <Button onClick={saveClinic}><Save size={14} /> Save Changes</Button>
          </div>
        </div>
      )}

      {tab === 'doctors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setShowAddDoc(true)}><Plus size={14} /> Add Doctor</Button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Speciality</th><th>Fee</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {state.doctors.map(d => (
                    <tr key={d.id}>
                      <td><strong>{d.name}</strong></td>
                      <td>{d.speciality}</td>
                      <td className="mono">₹{d.fee}</td>
                      <td>
                        <button className="toggle-btn" onClick={() => { dispatch({ type: 'TOGGLE_DOCTOR_AVAILABILITY', id: d.id }); addToast('info', `${d.name} availability toggled`) }}>
                          {d.available ? <ToggleRight size={22} color="#6DBF8A" /> : <ToggleLeft size={22} color="#F45B5B" />}
                        </button>
                      </td>
                      <td><span className="text-muted text-xs">{d.available ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Modal isOpen={showAddDoc} onClose={() => setShowAddDoc(false)} title="Add Doctor" size="sm">
            <div className="form-stack">
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={newDoc.name} onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Speciality</label><input className="form-input" value={newDoc.speciality} onChange={e => setNewDoc(d => ({ ...d, speciality: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Fee (₹)</label><input className="form-input" type="number" value={newDoc.fee} onChange={e => setNewDoc(d => ({ ...d, fee: e.target.value }))} /></div>
              <Button onClick={() => { addToast('success', '✓ Doctor added (demo)'); setShowAddDoc(false) }} className="w-full">Add Doctor</Button>
            </div>
          </Modal>
        </div>
      )}

      {tab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setShowAddSvc(true)}><Plus size={14} /> Add Service</Button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Service</th><th>Category</th><th>Price</th></tr></thead>
                <tbody>
                  {state.services.map(s => (
                    <tr key={s.id}><td>{s.name}</td><td>{s.category}</td><td className="mono">₹{s.price}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Modal isOpen={showAddSvc} onClose={() => setShowAddSvc(false)} title="Add Service" size="sm">
            <div className="form-stack">
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={newSvc.name} onChange={e => setNewSvc(s => ({ ...s, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={newSvc.price} onChange={e => setNewSvc(s => ({ ...s, price: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-input" value={newSvc.category} onChange={e => setNewSvc(s => ({ ...s, category: e.target.value }))}><option>Consultation</option><option>Diagnostics</option><option>Procedures</option></select>
              </div>
              <Button onClick={() => {
                if (!newSvc.name) return
                dispatch({ type: 'ADD_SERVICE', payload: { id: `S${String(state.services.length + 1).padStart(3, '0')}`, name: newSvc.name, price: Number(newSvc.price), category: newSvc.category } })
                addToast('success', `✓ Service "${newSvc.name}" added`)
                setShowAddSvc(false); setNewSvc({ name: '', price: '', category: 'Consultation' })
              }} className="w-full">Add Service</Button>
            </div>
          </Modal>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
              <tbody>
                {staffUsers.map(u => (
                  <tr key={u.email}><td><strong>{u.name}</strong></td><td><span className="status-badge" style={{ color: '#A78BFA', background: '#A78BFA15' }}>{u.role}</span></td><td>{u.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

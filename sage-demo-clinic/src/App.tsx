import { useReducer, useCallback, useState, useEffect } from 'react'
import {
  LayoutDashboard, Calendar, Users, Receipt, Pill, FlaskConical, Bell,
  BarChart3, Ticket, Settings, ClipboardList, FileText, Home, User,
  HeartPulse, ChevronDown, Menu, X, Edit, Crosshair, HelpCircle, Mail, Phone, Globe
} from 'lucide-react'
import { AppContext, appReducer, initialState } from './store'
import type { ToastData } from './data'
import { AGENCY, CLINIC } from './data'
import { ToastContainer, useApp, Button, Modal } from './ui'
import Dashboard from './modules/Dashboard'
import BookingModule from './modules/Booking'
import EMRModule from './modules/EMR'
import DoctorDashboard from './modules/DoctorDashboard'
import BillingModule from './modules/Billing'
import PharmacyModule from './modules/Pharmacy'
import LabModule from './modules/Lab'
import PrescriptionModule from './modules/Prescriptions'
import NotificationsModule from './modules/Notifications'
import AnalyticsModule from './modules/Analytics'
import PatientPortal from './modules/PatientPortal'
import QueueModule from './modules/Queue'
import SettingsModule from './modules/Settings'
import './App.css'

const ADMIN_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'booking', label: 'Appointments', icon: Calendar },
  { key: 'emr', label: 'Patient Records', icon: Users },
  { key: 'billing', label: 'Billing', icon: Receipt },
  { key: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { key: 'lab', label: 'Lab & Reports', icon: FlaskConical },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'queue', label: 'Queue / Tokens', icon: Ticket },
  { key: 'settings', label: 'Settings', icon: Settings },
]
const DOCTOR_NAV = [
  { key: 'doctor_dashboard', label: 'My Schedule', icon: ClipboardList },
  { key: 'emr', label: 'Patient Records', icon: Users },
  { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { key: 'lab', label: 'Lab Orders', icon: FlaskConical },
]
const PATIENT_NAV = [
  { key: 'patient_portal', label: 'Home', icon: Home },
]

const DEMO_TO_CONFIG_MAP: Record<string, string> = {
  dashboard: 'admin_panel',
  booking: 'online_booking',
  emr: 'emr_records',
  billing: 'billing_invoicing',
  pharmacy: 'pharmacy_inventory',
  lab: 'lab_module',
  notifications: 'notifications',
  analytics: 'analytics_reporting',
  queue: 'queue_mgmt',
  settings: 'admin_panel',
  doctor_dashboard: 'doctor_dashboard',
  prescriptions: 'digital_rx',
  patient_portal: 'patient_portal',
};

function Sidebar() {
  const { state, dispatch } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  let nav = state.currentUser.role === 'doctor' ? DOCTOR_NAV : state.currentUser.role === 'patient' ? PATIENT_NAV : ADMIN_NAV
  
  if (state.enabledModules && state.enabledModules.length > 0) {
    nav = nav.filter(item => {
      const configId = DEMO_TO_CONFIG_MAP[item.key];
      // Always show settings if admin panel is enabled, or fallback to true if no mapping
      if (!configId) return true;
      return state.enabledModules!.includes(configId);
    });
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${state.currentUser.role === 'patient' ? 'sidebar--hidden' : ''}`}>
      <div className="sidebar__logo" onClick={() => setCollapsed(!collapsed)}>
        <div className="sidebar__logo-icon"><HeartPulse size={20} /></div>
        {!collapsed && <span className="sidebar__logo-text">LC</span>}
      </div>
      <nav className="sidebar__nav">
        {nav.map(item => (
          <button key={item.key}
            className={`sidebar__item ${state.activeModule === item.key ? 'sidebar__item--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_MODULE', module: item.key })}
            title={item.label}>
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
            {item.key === 'notifications' && !collapsed && (
              (() => { const uc = state.notifications.filter(n => !n.read).length; return uc > 0 ? <span className="sidebar__badge">{uc}</span> : null })()
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function Topbar() {
  const { state, dispatch, addToast } = useApp()
  const [showRolePicker, setShowRolePicker] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)

  const unread = state.notifications.filter(n => !n.read).length
  const roleLabels: Record<string, string> = { admin: '🏥 Admin View', doctor: '👨‍⚕️ Doctor View', patient: '👤 Patient View' }

  const switchRole = (role: string) => {
    dispatch({ type: 'SET_ROLE', role })
    addToast('info', `👁 Switched to ${roleLabels[role]}`)
    setShowRolePicker(false)
  }

  return (
    <header className={`topbar ${state.currentUser.role === 'patient' ? 'topbar--light' : ''}`}>
      <div className="topbar__left">
        {state.editMode ? (
          <input className="topbar__clinic-edit" value={state.clinicName} onChange={e => dispatch({ type: 'SET_CLINIC_NAME', name: e.target.value })} />
        ) : (
          <h3 className="topbar__clinic">{state.clinicName}</h3>
        )}
      </div>
      <div className="topbar__right">
        <button className={`topbar__edit-toggle ${state.editMode ? 'topbar__edit-toggle--active' : ''}`}
          onClick={() => { dispatch({ type: 'TOGGLE_EDIT_MODE' }); addToast('info', state.editMode ? '✏️ Edit mode off' : '✏️ Edit mode on — click clinic name to change') }}
          title="Edit Mode">
          <Edit size={16} />
        </button>

        <div className="topbar__notif-wrapper">
          <button className="topbar__bell" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={18} />
            {unread > 0 && <span className="topbar__bell-badge">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="topbar__notif-dropdown fade-in">
              <h4>Notifications</h4>
              {state.notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`topbar__notif-item ${!n.read ? 'topbar__notif-item--unread' : ''}`}
                  onClick={() => dispatch({ type: 'MARK_NOTIFICATION', id: n.id })}>
                  <p>{n.message}</p>
                  <span className="text-muted text-xs">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="topbar__role-wrapper">
          <button className="topbar__role-btn" onClick={() => setShowRolePicker(!showRolePicker)}>
            {roleLabels[state.currentUser.role]} <ChevronDown size={14} />
          </button>
          {showRolePicker && (
            <div className="topbar__role-dropdown fade-in">
              {Object.entries(roleLabels).map(([key, label]) => (
                <button key={key} className={`topbar__role-option ${state.currentUser.role === key ? 'topbar__role-option--active' : ''}`}
                  onClick={() => switchRole(key)}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function ActiveModule() {
  const { state } = useApp()
  switch (state.activeModule) {
    case 'dashboard': return <Dashboard />
    case 'booking': return <BookingModule />
    case 'emr': return <EMRModule />
    case 'doctor_dashboard': return <DoctorDashboard />
    case 'billing': return <BillingModule />
    case 'pharmacy': return <PharmacyModule />
    case 'lab': return <LabModule />
    case 'prescriptions': return <PrescriptionModule />
    case 'notifications': return <NotificationsModule />
    case 'analytics': return <AnalyticsModule />
    case 'patient_portal': return <PatientPortal />
    case 'queue': return <QueueModule />
    case 'settings': return <SettingsModule />
    default: return <Dashboard />
  }
}

function DemoTour() {
  const { state, dispatch } = useApp()
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [showContact, setShowContact] = useState(false)

  const steps = [
    { title: 'Admin Dashboard', desc: 'See today\'s patient flow, revenue, and alerts — all at a glance.' },
    { title: 'Book Appointments', desc: 'Click Appointments in the sidebar to book in under 30 seconds.' },
    { title: 'Doctor View', desc: 'Switch to Doctor View (top-right) to see the full queue and write prescriptions.' },
    { title: 'Digital Prescriptions', desc: 'Generate professional prescriptions instantly — sent to patient\'s portal.' },
    { title: 'Everything Syncs', desc: 'Book here, see it in Doctor View and Patient Portal. Real-time, no delay.' },
  ]

  return (
    <>
      {/* FAB */}
      <button className="demo-fab" onClick={() => setActive(true)} title="Start Demo Tour">
        🎯 Start Demo Tour
      </button>

      {/* Tour Overlay */}
      {active && (
        <div className="demo-tour-overlay">
          <div className="demo-tour-card slide-up">
            <div className="demo-tour-step">{step + 1} / {steps.length}</div>
            <h3>{steps[step].title}</h3>
            <p>{steps[step].desc}</p>
            <div className="demo-tour-actions">
              {step > 0 && <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>← Previous</Button>}
              {step < steps.length - 1 ? (
                <Button size="sm" onClick={() => setStep(s => s + 1)}>Next →</Button>
              ) : (
                <Button size="sm" onClick={() => { setActive(false); setStep(0); setShowContact(true) }}>Finish ✓</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { setActive(false); setStep(0) }}>Skip</Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <Modal isOpen={showContact} onClose={() => setShowContact(false)} title="Ready to build this for your clinic?" size="sm">
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#6DBF8A', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>{AGENCY.name}</h3>
          <p style={{ marginBottom: 4 }}><Mail size={14} style={{ marginRight: 4 }} /> {AGENCY.email}</p>
          <p style={{ marginBottom: 4 }}><Phone size={14} style={{ marginRight: 4 }} /> {AGENCY.phone}</p>
          <p style={{ marginBottom: 16 }}><Globe size={14} style={{ marginRight: 4 }} /> {AGENCY.website}</p>
          <Button className="w-full" style={{ marginBottom: 8 }}>Configure My Solution →</Button>
          <Button variant="secondary" className="w-full">Download Brochure</Button>
        </div>
      </Modal>
    </>
  )
}

function KeyboardShortcuts() {
  const { dispatch, addToast } = useApp()
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      switch (e.key.toLowerCase()) {
        case 'd': dispatch({ type: 'SET_MODULE', module: 'dashboard' }); break
        case 'b': dispatch({ type: 'SET_MODULE', module: 'booking' }); break
        case 'p': dispatch({ type: 'SET_MODULE', module: 'emr' }); break
        case '1': dispatch({ type: 'SET_ROLE', role: 'admin' }); addToast('info', '👁 Switched to Admin View'); break
        case '2': dispatch({ type: 'SET_ROLE', role: 'doctor' }); addToast('info', '👁 Switched to Doctor View'); break
        case '3': dispatch({ type: 'SET_ROLE', role: 'patient' }); addToast('info', '👁 Switched to Patient View'); break
        case '?': addToast('info', 'Shortcuts: D=Dashboard, B=Booking, P=Patients, 1/2/3=Roles, Esc=Close'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch, addToast])
  return null
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addToast = useCallback((type: ToastData['type'], msg: string) => {
    const id = `t_${Date.now()}_${Math.random()}`
    dispatch({ type: 'ADD_TOAST', payload: { id, type, msg } })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3500)
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch, addToast }}>
      <div className={`app-shell ${state.currentUser.role === 'patient' ? 'app-shell--portal' : ''}`}>
        <Sidebar />
        <div className="app-main">
          <Topbar />
          <div className="app-content">
            <ActiveModule />
          </div>
        </div>
      </div>
      <ToastContainer />
      <DemoTour />
      <KeyboardShortcuts />
    </AppContext.Provider>
  )
}

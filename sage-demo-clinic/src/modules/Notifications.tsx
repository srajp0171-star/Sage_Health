import { useState } from 'react'
import { Bell, Calendar, AlertTriangle, IndianRupee, FlaskConical, Check, CheckCheck, Send } from 'lucide-react'
import { useApp, Button, SectionTitle, Tabs } from '../ui'

const typeIcons: Record<string, React.ComponentType<{ size?: number }>> = { appointment: Calendar, stock: AlertTriangle, payment: IndianRupee, lab: FlaskConical }
const typeColors: Record<string, string> = { appointment: '#4A9EFF', stock: '#F0B429', payment: '#F0B429', lab: '#6DBF8A' }

export default function NotificationsModule() {
  const { state, dispatch, addToast } = useApp()
  const [tab, setTab] = useState('all')

  const filtered = state.notifications.filter(n => {
    if (tab === 'unread') return !n.read
    if (tab === 'appointments') return n.type === 'appointment'
    if (tab === 'alerts') return n.type === 'stock' || n.type === 'payment'
    return true
  })
  const unreadCount = state.notifications.filter(n => !n.read).length

  // Tomorrow's appointments
  const tomorrowAppts = state.appointments.filter(a => a.date === '2025-07-08' && a.status === 'Scheduled')
  const getPatient = (id: string) => state.patients.find(p => p.id === id)

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Notifications & Reminders" subtitle={`${unreadCount} unread`}
        action={unreadCount > 0 ? <Button variant="secondary" size="sm" onClick={() => { dispatch({ type: 'MARK_ALL_READ' }); addToast('info', '✓ All notifications marked as read') }}><CheckCheck size={14} /> Mark All Read</Button> : undefined} />

      <Tabs tabs={[
        { key: 'all', label: `All (${state.notifications.length})` },
        { key: 'unread', label: `Unread (${unreadCount})` },
        { key: 'appointments', label: 'Appointments' },
        { key: 'alerts', label: 'Alerts' },
      ]} active={tab} onChange={setTab} />

      <div className="notification-list">
        {filtered.map(n => {
          const Icon = typeIcons[n.type] || Bell
          const color = typeColors[n.type] || '#8896B0'
          return (
            <div key={n.id} className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`}>
              <div className="notification-item__icon" style={{ background: `${color}15`, color }}><Icon size={16} /></div>
              <div className="notification-item__content">
                <p>{n.message}</p>
                <span className="text-muted text-xs">{n.time}</span>
              </div>
              <div className="notification-item__actions">
                {!n.read && <button className="text-btn text-btn--sm" onClick={() => dispatch({ type: 'MARK_NOTIFICATION', id: n.id })}>Mark Read</button>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming Reminders */}
      {tomorrowAppts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 className="card-title">📅 Tomorrow's Appointments</h4>
          <div className="card">
            {tomorrowAppts.map(a => {
              const p = getPatient(a.patientId)
              return (
                <div key={a.id} className="notification-item">
                  <div className="notification-item__icon" style={{ background: '#4A9EFF15', color: '#4A9EFF' }}><Calendar size={16} /></div>
                  <div className="notification-item__content">
                    <p><strong>{p?.name}</strong> – {a.time}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => addToast('success', `✓ SMS reminder sent to ${p?.name}`)}><Send size={14} /> Send Reminder</Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

import { useContext, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { AppContext } from './store'
import type { AppContextType } from './store'
import { statusColor, getInitials } from './utils'

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppContext')
  return ctx
}

/* ── Modal ─────────────────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    if (isOpen) { document.addEventListener('keydown', handleKey); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [isOpen, handleKey])
  if (!isOpen) return null
  const widths = { sm: 400, md: 560, lg: 720, xl: 900 }
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card slide-up" style={{ maxWidth: widths[size] }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

/* ── Button ────────────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', onClick, className = '', disabled = false, size = 'md', type = 'button' }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; onClick?: () => void;
  className?: string; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; type?: 'button' | 'submit'
}) {
  return (
    <button type={type} className={`btn btn--${variant} btn--${size} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

/* ── StatusBadge ────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: string }) {
  const color = statusColor(status)
  return (
    <span className="status-badge" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
      <span className="status-dot" style={{ background: color, boxShadow: status === 'In Queue' ? `0 0 6px ${color}` : 'none' }} />
      {status}
    </span>
  )
}

/* ── Avatar ─────────────────────────────────────────────────────────── */
export function Avatar({ name, size = 36, color = '#6DBF8A' }: { name: string; size?: number; color?: string }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: `${color}20`, color, border: `1.5px solid ${color}40` }}>
      {getInitials(name)}
    </div>
  )
}

/* ── StatCard ──────────────────────────────────────────────────────── */
export function StatCard({ title, value, subtitle, icon: Icon, color = '#6DBF8A' }: {
  title: string; value: string | number; subtitle?: string; icon: React.ComponentType<{ size?: number }>; color?: string
}) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: `${color}15`, color }}><Icon size={22} /></div>
      <div className="stat-card__info">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value" style={{ color }}>{value}</p>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

/* ── EmptyState ────────────────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: React.ComponentType<{ size?: number }>; title: string; subtitle: string; action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Icon size={40} /></div>
      <h4>{title}</h4>
      <p>{subtitle}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}

/* ── Toast Container ──────────────────────────────────────────────── */
export function ToastContainer() {
  const { state, dispatch } = useApp()
  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dispatch({ type: 'REMOVE_TOAST', id: t.id })} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: { id: string; type: string; msg: string }; onDismiss: () => void }) {
  useEffect(() => { const timer = setTimeout(onDismiss, 3500); return () => clearTimeout(timer) }, [onDismiss])
  const colors: Record<string, string> = { success: '#6DBF8A', error: '#F45B5B', warning: '#F0B429', info: '#4A9EFF' }
  const c = colors[toast.type] || colors.info
  return (
    <div className="toast-item slide-up" style={{ borderLeft: `3px solid ${c}` }} onClick={onDismiss}>
      <span className="toast-dot" style={{ background: c }} />
      <span className="toast-msg">{toast.msg}</span>
    </div>
  )
}

/* ── Section Title ─────────────────────────────────────────────────── */
export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="section-title-row">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ── Tabs ───────────────────────────────────────────────────────────── */
export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="tabs-row">
      {tabs.map(t => (
        <button key={t.key} className={`tab-btn ${active === t.key ? 'tab-btn--active' : ''}`} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

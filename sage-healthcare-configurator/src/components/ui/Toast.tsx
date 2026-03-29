import { useUIStore } from '@/store/uiStore'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

const TOAST_STYLES = {
  success: { icon: CheckCircle, bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400' },
  info:    { icon: Info, bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
  error:   { icon: AlertCircle, bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' },
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => {
        const style = TOAST_STYLES[toast.type]
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className={clsx(
              'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm animate-slide-in-right',
              style.bg,
            )}
          >
            <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', style.text)} />
            <p className="text-sm text-white/90 flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

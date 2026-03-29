import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'recommended' | 'advanced' | 'optional' | 'info' | 'success'
  children: React.ReactNode
  className?: string
}

const BADGE_STYLES = {
  recommended: 'bg-sage/15 text-sage border-sage/30',
  advanced:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  optional:    'bg-gray-500/15 text-gray-400 border-gray-500/30',
  info:        'bg-sky-500/15 text-sky-400 border-sky-500/30',
  success:     'bg-green-500/15 text-green-400 border-green-500/30',
}

export const Badge = ({ variant = 'info', children, className }: BadgeProps) => {
  return (
    <span className={clsx(
      'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border',
      BADGE_STYLES[variant],
      className,
    )}>
      {children}
    </span>
  )
}

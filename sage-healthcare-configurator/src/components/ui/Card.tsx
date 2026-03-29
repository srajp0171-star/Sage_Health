import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  selected?: boolean
  onClick?: () => void
}

export const Card = ({ children, className, hover = false, selected = false, onClick }: CardProps) => {
  return (
    <div
      className={twMerge(clsx(
        'bg-dark-card border rounded-xl transition-all duration-300',
        selected ? 'border-sage shadow-lg shadow-sage/10' : 'border-dark-border',
        hover && !selected && 'hover:border-dark-border/80 hover:bg-dark-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      ))}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

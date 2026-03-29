import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { formatINR } from '@/utils/formatCurrency'

interface AnimatedNumberProps {
  value:      number
  format?:    'currency' | 'number'
  prefix?:    string
  suffix?:    string
  duration?:  number
  className?: string
}

export const AnimatedNumber = ({
  value,
  format    = 'currency',
  prefix    = '',
  suffix    = '',
  duration  = 400,
  className = '',
}: AnimatedNumberProps) => {
  const animated = useCounterAnimation(value, duration)

  const display =
    format === 'currency' ? formatINR(animated) :
    animated.toLocaleString('en-IN')

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}

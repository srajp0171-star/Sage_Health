import { useEffect, useRef, useState } from 'react'

export const useCounterAnimation = (
  target:   number,
  duration: number = 400,
): number => {
  const [current, setCurrent] = useState(target)
  const prevRef      = useRef(target)
  const frameRef     = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (prevRef.current === target) return

    const from = prevRef.current
    prevRef.current = target

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed  = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(from + (target - from) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCurrent(target)
        frameRef.current = null
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return current
}

export const formatINR = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount))
}

export const formatINRCompact = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0'
  const n = Math.round(amount)
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return `₹${n}`
}

export const formatMonthly = (total: number, months: number = 36): string => {
  const monthly = Math.round(total / months / 100) * 100
  return `~${formatINR(monthly)}/mo`
}

export const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50)
}

export const formatDateForFilename = (date: Date = new Date()): string => {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}${m}${y}`
}

export const formatDateLong = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

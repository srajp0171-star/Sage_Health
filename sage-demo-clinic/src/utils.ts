import { DEMO_TODAY } from './data'

export const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export const formatDate = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

export const isToday = (dateStr: string) => dateStr === DEMO_TODAY
export const isFuture = (dateStr: string) => dateStr > DEMO_TODAY
export const isPast = (dateStr: string) => dateStr < DEMO_TODAY

export const newId = (prefix: string, list: { id: string }[]) =>
  `${prefix}${String(list.length + 1).padStart(3, '0')}`

export const statusColor = (status: string) => {
  const map: Record<string, string> = {
    'Completed': '#6DBF8A', 'Paid': '#6DBF8A', 'Report Ready': '#6DBF8A', 'In Stock': '#6DBF8A',
    'In Queue': '#6DBF8A', 'Waiting': '#F0B429', 'Partial': '#F0B429', 'Pending': '#F0B429', 'Low Stock': '#F0B429',
    'Scheduled': '#4A9EFF', 'Cancelled': '#F45B5B', 'Unpaid': '#F45B5B', 'No Show': '#F45B5B', 'Critical': '#F45B5B',
  }
  return map[status] || '#8896B0'
}

export const formatTime12 = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

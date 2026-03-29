import { useState } from 'react'
import { Ticket, ArrowRight, Users, Clock } from 'lucide-react'
import { useApp, Button, StatusBadge, SectionTitle, Avatar } from '../ui'
import { DOCTORS } from '../data'
import { formatTime12, isToday, newId } from '../utils'

export default function QueueModule() {
  const { state, dispatch, addToast } = useApp()
  const todayAppts = state.appointments.filter(a => isToday(a.date) && a.status !== 'Cancelled').sort((a, b) => a.time.localeCompare(b.time))
  const getPatient = (id: string) => state.patients.find(p => p.id === id)
  const getDoctor = (id: string) => DOCTORS.find(d => d.id === id)

  const currentToken = todayAppts.find(a => a.status === 'In Queue')
  const nextTokens = todayAppts.filter(a => a.status === 'Waiting' || a.status === 'Scheduled').slice(0, 3)

  const callNext = () => {
    // Complete current
    if (currentToken) dispatch({ type: 'UPDATE_APPT_STATUS', id: currentToken.id, status: 'Completed' })
    // Find next waiting/scheduled
    const next = todayAppts.find(a => (a.status === 'Waiting' || a.status === 'Scheduled') && a.id !== currentToken?.id)
    if (next) {
      dispatch({ type: 'UPDATE_APPT_STATUS', id: next.id, status: 'In Queue' })
      addToast('info', `↻ Now serving: ${getPatient(next.patientId)?.name}`)
    } else {
      addToast('info', 'No more patients in queue')
    }
  }

  const skipCurrent = () => {
    if (!currentToken) return
    dispatch({ type: 'UPDATE_APPT_STATUS', id: currentToken.id, status: 'Waiting' })
    addToast('warning', '⏭ Patient skipped, moved back to waiting')
    callNext()
  }

  const markNoShow = (id: string) => {
    dispatch({ type: 'UPDATE_APPT_STATUS', id, status: 'No Show' })
    addToast('warning', '⚠ Marked as no-show')
  }

  return (
    <div className="module-page fade-in">
      <SectionTitle title="Queue / Token Management" subtitle={`${todayAppts.length} patients today`} />
      <div className="queue-layout">
        {/* Control Panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <Button onClick={callNext} className="w-full" style={{ marginBottom: 8 }}><ArrowRight size={16} /> Call Next Patient</Button>
            {currentToken && <Button variant="secondary" onClick={skipCurrent} className="w-full">⏭ Skip Current</Button>}
          </div>
          <h4 className="card-title" style={{ marginBottom: 8 }}>Token Queue</h4>
          {todayAppts.map((a, i) => {
            const p = getPatient(a.patientId)
            const d = getDoctor(a.doctorId)
            return (
              <div key={a.id} className={`queue-row ${a.status === 'In Queue' ? 'queue-row--active' : ''} ${a.status === 'Completed' ? 'queue-row--done' : ''}`}>
                <span className="queue-row__token mono">T-{String(i + 1).padStart(2, '0')}</span>
                <div className="queue-row__info">
                  <strong>{p?.name || '–'}</strong>
                  <span className="text-muted text-xs">{d?.name} · {formatTime12(a.time)}</span>
                </div>
                <StatusBadge status={a.status} />
                {a.status === 'Scheduled' && <button className="text-btn text-btn--red text-btn--sm" onClick={() => markNoShow(a.id)}>No-Show</button>}
              </div>
            )
          })}
        </div>

        {/* Live Display Preview */}
        <div className="tv-display">
          <div className="tv-display__frame">
            <div className="tv-display__header">
              <h3>{state.clinicName}</h3>
            </div>
            <div className="tv-display__now">
              <p className="tv-display__label">NOW SERVING</p>
              {currentToken ? (
                <div className="tv-display__token token-flash">
                  <span className="tv-display__token-num mono">T-{String(todayAppts.indexOf(currentToken) + 1).padStart(2, '0')}</span>
                  <span>{getDoctor(currentToken.doctorId)?.name}</span>
                  <span className="text-muted">Room 1</span>
                </div>
              ) : (
                <div className="tv-display__token">
                  <span className="text-muted">No active patient</span>
                </div>
              )}
            </div>
            <div className="tv-display__next">
              <p className="tv-display__label">NEXT</p>
              <div className="tv-display__next-list">
                {nextTokens.map((a, i) => (
                  <span key={a.id} className="mono">T-{String(todayAppts.indexOf(a) + 1).padStart(2, '0')}</span>
                ))}
                {nextTokens.length === 0 && <span className="text-muted">—</span>}
              </div>
            </div>
            <div className="tv-display__wait">
              <Clock size={14} /> Average Wait: ~12 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

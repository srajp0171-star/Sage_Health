import type { Module, Phase } from '@/types'

interface TimelineInput {
  selectedModules: Module[]
}

export const generateTimeline = ({ selectedModules }: TimelineInput): Phase[] => {
  if (selectedModules.length === 0) return []

  const lowMedium = selectedModules.filter(m => m.complexity !== 'high')
  const high      = selectedModules.filter(m => m.complexity === 'high')
  const hasHigh   = high.length > 0
  const total     = selectedModules.length

  const coreWeeksMin = Math.max(2, ...lowMedium.map(m => m.weeksMin), 2)
  const coreWeeksMax = Math.max(3, ...lowMedium.map(m => m.weeksMax), 3)

  const advWeeksMin  = hasHigh ? Math.max(...high.map(m => m.weeksMin)) : 0
  const advWeeksMax  = hasHigh ? Math.max(...high.map(m => m.weeksMax)) : 0

  const testMin = 1
  const testMax = total <= 4 ? 1 : 2

  const phases: Phase[] = []

  phases.push({
    name: 'Discovery & Planning',
    activities: [
      'Stakeholder walkthrough and requirement confirmation',
      'Finalize module scope and user flows',
      'Technology and hosting decisions',
      'Project kickoff and timeline agreement',
    ],
    weeksMin: 1,
    weeksMax: 1,
  })

  phases.push({
    name: 'UX/UI Design',
    activities: [
      'Wireframes for all key screens',
      'Visual design — brand, color, typography',
      'Mobile-first responsive layouts',
      'Design review and iteration round',
    ],
    weeksMin: total >= 5 || hasHigh ? 2 : 1,
    weeksMax: total >= 5 || hasHigh ? 2 : 1,
  })

  if (lowMedium.length > 0) {
    phases.push({
      name: 'Core Module Build',
      activities: [
        ...lowMedium.map(m => m.name),
        'Unit tests for core flows',
        'Internal QA pass',
      ],
      weeksMin: coreWeeksMin,
      weeksMax: coreWeeksMax,
    })
  }

  if (hasHigh) {
    phases.push({
      name: 'Advanced Module Build',
      activities: [
        ...high.map(m => m.name),
        'Integration testing between advanced modules',
        'Security review for data-heavy modules',
      ],
      weeksMin: advWeeksMin,
      weeksMax: advWeeksMax,
    })
  }

  phases.push({
    name: 'Testing & UAT',
    activities: [
      'Functional testing across all modules',
      'Device and browser compatibility checks',
      'UAT session with clinic staff',
      'Bug fixes and final adjustments',
    ],
    weeksMin: testMin,
    weeksMax: testMax,
  })

  phases.push({
    name: 'Go-Live, Hosting & Training',
    activities: [
      'Domain, hosting, and SSL configuration',
      'Production deployment and smoke testing',
      'Staff training session (in-person or video)',
      'Handover of admin credentials and documentation',
    ],
    weeksMin: 1,
    weeksMax: 1,
  })

  return phases
}

export const computeTotalWeeks = (phases: Phase[]): { min: number; max: number } => {
  const min = phases.reduce((sum, p) => sum + p.weeksMin, 0)
  const max = phases.reduce((sum, p) => sum + p.weeksMax, 0)
  return { min, max }
}

import type { IntakeFormData, Module } from '@/types'

const CLINIC_TYPE_LABELS: Record<string, string> = {
  solo:            'solo practice',
  single:          'single-location clinic',
  multiSpeciality: 'multi-speciality clinic',
  smallHospital:   'small hospital',
  chain:           'multi-branch clinic chain',
}

const SPECIALITY_LABELS: Record<string, string> = {
  general:         'General / Family Medicine',
  dental:          'Dental',
  dermatology:     'Dermatology',
  orthopaedic:     'Orthopaedic',
  paediatrics:     'Paediatrics',
  eyeCare:         'Eye Care',
  ent:             'ENT',
  gynaecology:     'Gynaecology',
  multiSpeciality: 'Multi-Speciality',
  other:           'Speciality Practice',
}

const GOAL_LABELS: Record<string, string> = {
  presence:         'establishing a strong online presence',
  booking:          'enabling 24/7 online appointment booking',
  noShows:          'reducing patient no-shows',
  teleconsultation: 'offering teleconsultation services',
  records:          'going paperless with digital patient records',
  billing:          'streamlining billing and invoicing',
  growth:           'growing patient engagement and recall',
  whatsapp:         'enabling WhatsApp-first patient communication',
  analytics:        'gaining operational analytics and insights',
  multiLocation:    'managing multiple clinic branches centrally',
}

export const generateExecutiveSummary = (
  intake: IntakeFormData,
  selectedModules: Module[],
  totalOneTime: number,
  totalWeeksMin: number,
  totalWeeksMax: number,
): string[] => {
  const clinicTypeLabel = CLINIC_TYPE_LABELS[intake.clinicType] ?? 'clinic'
  const specialityLabel = SPECIALITY_LABELS[intake.speciality] ?? 'speciality practice'
  const categories      = [...new Set(selectedModules.map(m => m.category))]
  const goalLabels      = intake.primaryGoals
                            .slice(0, 3)
                            .map(g => GOAL_LABELS[g] ?? g)

  const categoryNames: Record<string, string> = {
    base:        'digital presence',
    operational: 'clinical operations',
    patient:     'patient experience',
    telemedicine:'telemedicine & communication',
    business:    'business growth',
    access:      'access control & scaling',
  }

  const categoryLabels = categories.map(c => categoryNames[c] ?? c).join(', ')

  const INR = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(totalOneTime)

  return [
    `We are proposing a ${selectedModules.length}-module digital platform for ${intake.clinicName}, a ${clinicTypeLabel} specialising in ${specialityLabel}. The solution spans ${categoryLabels}, giving the clinic a complete, owned digital infrastructure.`,

    `This platform is specifically designed to help ${intake.clinicName} achieve its stated goals of ${goalLabels.join(', ')}. Every module selected addresses a direct operational or patient-experience challenge the clinic faces today.`,

    `The total one-time investment for this solution is ${INR} (exclusive of GST). Following project confirmation, the estimated go-live timeline is ${totalWeeksMin}–${totalWeeksMax} weeks. This is a one-time build — there are no recurring platform fees. ${intake.clinicName} owns the platform outright from day one.`,
  ]
}

export const generateAssumptions = (
  intake: IntakeFormData,
  selectedModules: Module[],
): string[] => {
  const assumptions: string[] = [
    'Client will provide all content assets (logo, images, doctor photos, service descriptions, clinic copy) within 3 business days of project kickoff.',
    'Domain registration, web hosting, and SSL certificate costs are not included in this proposal and will be billed separately (estimated ₹5,000–₹15,000 per year depending on hosting tier).',
    'SMS, email, and WhatsApp Business API usage costs are not included — these are third-party costs billed directly by providers (e.g., MSG91, Twilio, Gupshup).',
    'This proposal assumes no complex data migration from existing paper records or legacy systems. If historical patient data migration is required, this will be scoped and quoted separately.',
    'Integration with any third-party marketplace, aggregator, or external platform not listed in this proposal is out of scope.',
    'Regulatory certifications such as ABDM compliance, NABH digital standards, or ISO 27001 are not included and can be scoped separately if required.',
  ]

  const hasExternalIntegration = selectedModules.some(m => m.id === 'external_integration')
  if (intake.hasExistingHIS && !hasExternalIntegration) {
    assumptions.push('An External HIS/EMR Integration module has not been included. If integration with the existing HIS is required, this will need to be scoped after a discovery call with the HIS vendor.')
  }

  const hasIPD = selectedModules.some(m => m.id === 'opd_ipd_mgmt')
  if (intake.hasIPD && !hasIPD) {
    assumptions.push('OPD/IPD management has not been included in this scope. In-patient workflows can be added as a future module.')
  }

  return assumptions
}

import type { IntakeFormData } from '@/types'

const VOLUME_MAP: Record<string, number> = {
  'under10': 5, '10-30': 20, '30-60': 45, '60+': 75,
}
const DOCTOR_MAP: Record<string, number> = {
  '1': 1, '2-3': 2, '4-10': 5, '10+': 12,
}
const BRANCH_MAP: Record<string, number> = {
  '1': 1, '2-3': 2, '4+': 5,
}
const STAFF_MAP: Record<string, number> = {
  '1-3': 2, '4-10': 7, '10+': 15,
}

export const computeRecommendations = (intake: IntakeFormData): string[] => {
  const ids  = new Set<string>()
  const v    = VOLUME_MAP[intake.dailyVolume]  ?? 5
  const d    = DOCTOR_MAP[intake.doctorCount]  ?? 1
  const b    = BRANCH_MAP[intake.branchCount]  ?? 1
  const s    = STAFF_MAP[intake.staffSize]     ?? 2
  const g    = new Set(intake.primaryGoals)

  // Always included
  ids.add('base_digital_presence')
  ids.add('online_booking')
  ids.add('admin_panel')

  // Volume / doctor triggers
  if (v > 10 || d > 1)   ids.add('billing_invoicing')
  if (v > 10 || d > 1)   ids.add('digital_rx')
  if (v > 15)             ids.add('patient_portal')
  if (v > 15)             ids.add('notifications')
  if (v > 20)             ids.add('emr_records')
  if (v > 20)             ids.add('analytics_reporting')
  if (v > 20 || d > 2)   ids.add('doctor_dashboard')
  if (v > 30)             ids.add('queue_mgmt')
  if (v > 30)             ids.add('marketing_automation')

  // Speciality triggers
  if (intake.speciality !== 'general' && intake.speciality !== 'multiSpeciality') {
    ids.add('intake_consent')
  }

  // Toggle triggers
  if (intake.hasPharmacy)    { ids.add('pharmacy_inventory'); ids.add('billing_invoicing') }
  if (intake.hasLab)           ids.add('lab_module')
  if (intake.hasIPD)         { ids.add('opd_ipd_mgmt'); ids.add('billing_invoicing') }
  if (intake.hasExistingHIS)   ids.add('external_integration')

  // Branch / staff triggers
  if (b > 1)               { ids.add('multi_branch'); ids.add('rbac') }
  if (s > 5 || d > 2)        ids.add('rbac')

  // Goal triggers
  if (g.has('teleconsultation'))  ids.add('teleconsultation')
  if (g.has('whatsapp'))          ids.add('whatsapp_booking')
  if (g.has('noShows'))           ids.add('notifications')
  if (g.has('growth'))          { ids.add('crm'); ids.add('marketing_automation') }
  if (g.has('analytics'))         ids.add('analytics_reporting')
  if (g.has('records'))           ids.add('emr_records')
  if (g.has('billing'))           ids.add('billing_invoicing')

  return [...ids]
}

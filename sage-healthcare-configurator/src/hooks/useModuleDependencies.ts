import { useCallback } from 'react'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'

interface DependencyRule {
  requires?: string[]
  suggests?: string[]
  message:   string
}

const RULES: Record<string, DependencyRule> = {
  multi_branch:        { requires: ['rbac'],              message: 'Role-Based Access Control was auto-added — it\'s required for multi-branch setups.' },
  patient_app:         { requires: ['patient_portal'],    message: 'Patient Portal was auto-added — it\'s required for the Mobile App.' },
  pharmacy_inventory:  { requires: ['billing_invoicing'], message: 'Billing & Invoicing was auto-added — it\'s required for Pharmacy.' },
  opd_ipd_mgmt:        { requires: ['billing_invoicing'], message: 'Billing & Invoicing was auto-added — it\'s required for OPD/IPD Management.' },
  notifications:       { suggests: ['online_booking'],    message: 'Notifications work best when paired with Online Appointment Booking.' },
  lab_module:          { suggests: ['emr_records'],       message: 'Lab Reports link seamlessly with EMR / Patient Records.' },
  digital_rx:          { suggests: ['doctor_dashboard'],  message: 'Digital Prescriptions pair well with the Doctor Dashboard.' },
  marketing_automation:{ suggests: ['crm'],               message: 'Marketing Automation works best with CRM & Lead Management.' },
}

export const useModuleDependencies = () => {
  const { setModuleSelected, selectedModuleIds } = useConfiguratorStore()
  const { addToast } = useUIStore()

  const enforceOnAdd = useCallback((id: string) => {
    const rule = RULES[id]
    if (!rule) return

    if (rule.requires) {
      const missing = rule.requires.filter(dep => !selectedModuleIds.has(dep))
      if (missing.length > 0) {
        missing.forEach(dep => setModuleSelected(dep, true))
        addToast({ type: 'info', message: rule.message })
      }
    }

    if (rule.suggests) {
      const unselected = rule.suggests.filter(dep => !selectedModuleIds.has(dep))
      if (unselected.length > 0) {
        addToast({ type: 'info', message: rule.message, duration: 6000 })
      }
    }
  }, [selectedModuleIds, setModuleSelected, addToast])

  const checkOnRemove = useCallback((id: string): string | null => {
    const dependents = Object.entries(RULES)
      .filter(([, rule]) => rule.requires?.includes(id))
      .map(([moduleId]) => moduleId)
      .filter(moduleId => selectedModuleIds.has(moduleId))

    if (dependents.length === 0) return null
    return `Note: ${dependents.join(', ')} depends on this module. It will still work but may have reduced functionality.`
  }, [selectedModuleIds])

  return { enforceOnAdd, checkOnRemove }
}

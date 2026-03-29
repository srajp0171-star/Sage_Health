import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { IntakeFormData, Goal } from '@/types'

const DEFAULT_INTAKE: IntakeFormData = {
  clinicName:     '',
  clinicType:     'single',
  speciality:     'general',
  doctorCount:    '1',
  dailyVolume:    'under10',
  branchCount:    '1',
  staffSize:      '1-3',
  hasPharmacy:    false,
  hasLab:         false,
  hasIPD:         false,
  hasExistingHIS: false,
  primaryGoals:   [] as Goal[],
  budgetBand:     'moderate',
  timeline:       'flexible',
}

export const BUDGET_BAND_VALUES: Record<string, number> = {
  tight:       120000,
  moderate:    200000,
  comfortable: 400000,
  flexible:    Infinity,
}

interface ConfiguratorState {
  intake:              IntakeFormData
  selectedModuleIds:   Set<string>
  recommendedIds:      Set<string>
  customPrices:        Record<string, number>
  intakeCompleted:     boolean

  setIntake:           (data: IntakeFormData) => void
  toggleModule:        (id: string) => void
  setModuleSelected:   (id: string, selected: boolean) => void
  bulkSetSelected:     (ids: string[], selected: boolean) => void
  setRecommended:      (ids: string[]) => void
  resetToRecommended:  () => void
  setCustomPrice:      (id: string, price: number) => void
  resetCustomPrice:    (id: string) => void
  resetAll:            () => void
  getModulePrice:      (id: string, basePrice: number) => number
  getBudgetLimit:      () => number
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  immer((set, get) => ({
    intake:            { ...DEFAULT_INTAKE },
    selectedModuleIds: new Set<string>(),
    recommendedIds:    new Set<string>(),
    customPrices:      {},
    intakeCompleted:   false,

    setIntake: (data) => set(state => {
      state.intake = data
      state.intakeCompleted = true
    }),

    toggleModule: (id) => set(state => {
      if (state.selectedModuleIds.has(id)) {
        state.selectedModuleIds.delete(id)
      } else {
        state.selectedModuleIds.add(id)
      }
    }),

    setModuleSelected: (id, selected) => set(state => {
      if (selected) {
        state.selectedModuleIds.add(id)
      } else {
        state.selectedModuleIds.delete(id)
      }
    }),

    bulkSetSelected: (ids, selected) => set(state => {
      ids.forEach(id => {
        if (selected) state.selectedModuleIds.add(id)
        else state.selectedModuleIds.delete(id)
      })
    }),

    setRecommended: (ids) => set(state => {
      state.recommendedIds = new Set(ids)
      state.selectedModuleIds = new Set(ids)
    }),

    resetToRecommended: () => set(state => {
      state.selectedModuleIds = new Set(state.recommendedIds)
    }),

    setCustomPrice: (id, price) => set(state => {
      state.customPrices[id] = price
    }),

    resetCustomPrice: (id) => set(state => {
      delete state.customPrices[id]
    }),

    resetAll: () => set(state => {
      state.intake            = { ...DEFAULT_INTAKE }
      state.selectedModuleIds = new Set()
      state.recommendedIds    = new Set()
      state.customPrices      = {}
      state.intakeCompleted   = false
    }),

    getModulePrice: (id, basePrice) => {
      const custom = get().customPrices[id]
      return custom !== undefined ? custom : basePrice
    },

    getBudgetLimit: () => {
      return BUDGET_BAND_VALUES[get().intake.budgetBand] ?? Infinity
    },
  }))
)

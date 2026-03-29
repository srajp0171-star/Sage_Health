import { create } from 'zustand'
import type { Toast } from '@/types'

type Step = 1 | 2 | 3 | 4

interface UIState {
  currentStep:      Step
  toasts:           Toast[]
  activeCategory:   string
  searchQuery:      string
  drawerModuleId:   string | null
  isMobileMenuOpen: boolean

  goToStep:          (step: Step) => void
  nextStep:          () => void
  prevStep:          () => void
  addToast:          (toast: Omit<Toast, 'id'>) => void
  removeToast:       (id: string) => void
  setActiveCategory: (category: string) => void
  setSearchQuery:    (q: string) => void
  openDrawer:        (moduleId: string) => void
  closeDrawer:       () => void
  toggleMobileMenu:  () => void
}

let toastCounter = 0

export const useUIStore = create<UIState>((set, get) => ({
  currentStep:      1,
  toasts:           [],
  activeCategory:   'base',
  searchQuery:      '',
  drawerModuleId:   null,
  isMobileMenuOpen: false,

  goToStep: (step) => set({ currentStep: step }),

  nextStep: () => set(state => ({
    currentStep: Math.min(4, state.currentStep + 1) as Step,
  })),

  prevStep: () => set(state => ({
    currentStep: Math.max(1, state.currentStep - 1) as Step,
  })),

  addToast: (toast) => {
    const id = `toast_${++toastCounter}_${Date.now()}`
    set(state => ({ toasts: [...state.toasts, { ...toast, id }] }))
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration)
    }
  },

  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),

  setActiveCategory:  (category) => set({ activeCategory: category }),
  setSearchQuery:     (q)        => set({ searchQuery: q }),
  openDrawer:         (moduleId) => set({ drawerModuleId: moduleId }),
  closeDrawer:        ()         => set({ drawerModuleId: null }),
  toggleMobileMenu:   ()         => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}))

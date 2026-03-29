export type ClinicType = 'solo' | 'single' | 'multiSpeciality' | 'smallHospital' | 'chain'
export type Speciality = 'general' | 'dental' | 'dermatology' | 'orthopaedic' | 'paediatrics' | 'eyeCare' | 'ent' | 'gynaecology' | 'multiSpeciality' | 'other'
export type DoctorCount = '1' | '2-3' | '4-10' | '10+'
export type DailyVolume = 'under10' | '10-30' | '30-60' | '60+'
export type BranchCount = '1' | '2-3' | '4+'
export type StaffSize = '1-3' | '4-10' | '10+'
export type BudgetBand = 'tight' | 'moderate' | 'comfortable' | 'flexible'
export type Timeline = 'asap' | '2-3months' | 'flexible'
export type Goal = 'presence' | 'booking' | 'noShows' | 'teleconsultation' | 'records' | 'billing' | 'growth' | 'whatsapp' | 'analytics' | 'multiLocation'
export type Complexity = 'low' | 'medium' | 'high'
export type Badge = 'recommended' | 'advanced' | 'optional'
export type Category = 'base' | 'operational' | 'patient' | 'telemedicine' | 'business' | 'access'

export interface Module {
  id:            string
  name:          string
  category:      Category
  icon:          string
  oneTime:       number
  saasLow:       number
  saasHigh:      number
  complexity:    Complexity
  weeksMin:      number
  weeksMax:      number
  badge:         Badge
  description:   string
  clientValue:   string
  features:      string[]
  dependencies:  string[]
  smartTriggers: string[]
  notesForAdmin: string
}

export interface Phase {
  name:       string
  activities: string[]
  weeksMin:   number
  weeksMax:   number
}

export interface Bundle {
  id:          string
  name:        string
  moduleIds:   string[]
  discountPct: number
  label:       string
}

export interface Toast {
  id:       string
  type:     'success' | 'warning' | 'info' | 'error'
  message:  string
  duration?: number
}

export interface IntakeFormData {
  clinicName:     string
  clinicType:     ClinicType
  speciality:     Speciality
  doctorCount:    DoctorCount
  dailyVolume:    DailyVolume
  branchCount:    BranchCount
  staffSize:      StaffSize
  hasPharmacy:    boolean
  hasLab:         boolean
  hasIPD:         boolean
  hasExistingHIS: boolean
  primaryGoals:   Goal[]
  budgetBand:     BudgetBand
  timeline:       Timeline
}

import { z } from 'zod'

export const intakeSchema = z.object({
  clinicName:    z.string().min(2, 'Clinic name required'),
  clinicType:    z.enum(['solo', 'single', 'multiSpeciality', 'smallHospital', 'chain']),
  speciality:    z.enum(['general', 'dental', 'dermatology', 'orthopaedic', 'paediatrics', 'eyeCare', 'ent', 'gynaecology', 'multiSpeciality', 'other']),
  doctorCount:   z.enum(['1', '2-3', '4-10', '10+']),
  dailyVolume:   z.enum(['under10', '10-30', '30-60', '60+']),
  branchCount:   z.enum(['1', '2-3', '4+']),
  staffSize:     z.enum(['1-3', '4-10', '10+']),
  hasPharmacy:   z.boolean(),
  hasLab:        z.boolean(),
  hasIPD:        z.boolean(),
  hasExistingHIS:z.boolean(),
  primaryGoals:  z.array(z.string()).min(1, 'Select at least one goal'),
  budgetBand:    z.enum(['tight', 'moderate', 'comfortable', 'flexible']),
  timeline:      z.enum(['asap', '2-3months', 'flexible']),
})

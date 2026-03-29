import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { intakeSchema } from '@/utils/validators'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'
import { computeRecommendations } from '@/hooks/useSmartRecommendation'
import { Button } from '@/components/ui/Button'
import { sanitizeClinicName } from '@/utils/sanitize'
import type { IntakeFormData, Goal } from '@/types'
import { clsx } from 'clsx'

const CLINIC_TYPES = [
  { value: 'solo', label: 'Solo Practice', desc: 'Single doctor, 5–15 patients/day' },
  { value: 'single', label: 'Single Clinic', desc: '1–3 doctors, 15–40 patients/day' },
  { value: 'multiSpeciality', label: 'Multi-Speciality', desc: '4–10 doctors, 40–80 patients/day' },
  { value: 'smallHospital', label: 'Small Hospital', desc: '10+ doctors, 80+ patients/day' },
  { value: 'chain', label: 'Clinic Chain', desc: '2–10 branches' },
]

const SPECIALITIES = [
  'general', 'dental', 'dermatology', 'orthopaedic', 'paediatrics',
  'eyeCare', 'ent', 'gynaecology', 'multiSpeciality', 'other',
]

const GOALS: { value: Goal; label: string }[] = [
  { value: 'presence', label: 'Establish online presence' },
  { value: 'booking', label: 'Online appointment booking' },
  { value: 'noShows', label: 'Reduce no-shows' },
  { value: 'teleconsultation', label: 'Teleconsultation / video' },
  { value: 'records', label: 'Paperless records / EMR' },
  { value: 'billing', label: 'Billing & invoicing' },
  { value: 'growth', label: 'Patient engagement & marketing' },
  { value: 'whatsapp', label: 'WhatsApp-first patient flow' },
  { value: 'analytics', label: 'Analytics & reporting' },
  { value: 'multiLocation', label: 'Multi-branch management' },
]

const BUDGET_BANDS = [
  { value: 'tight', label: 'Under ₹1.2L', desc: 'Core features only' },
  { value: 'moderate', label: '₹1.2L–₹2L', desc: 'Well-rounded solution' },
  { value: 'comfortable', label: '₹2L–₹4L', desc: 'Comprehensive platform' },
  { value: 'flexible', label: 'Flexible', desc: 'Best-fit modules regardless of budget' },
]

export const IntakeForm = () => {
  const { setIntake, setRecommended } = useConfiguratorStore()
  const { nextStep } = useUIStore()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      clinicName: '',
      clinicType: 'single',
      speciality: 'general',
      doctorCount: '1',
      dailyVolume: 'under10',
      branchCount: '1',
      staffSize: '1-3',
      hasPharmacy: false,
      hasLab: false,
      hasIPD: false,
      hasExistingHIS: false,
      primaryGoals: [],
      budgetBand: 'moderate',
      timeline: 'flexible',
    },
  })

  const selectedGoals = watch('primaryGoals') || []

  const toggleGoal = (goal: Goal) => {
    const current = selectedGoals as string[]
    const next = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal]
    setValue('primaryGoals', next as Goal[], { shouldValidate: true })
  }

  const onSubmit = (data: IntakeFormData) => {
    data.clinicName = sanitizeClinicName(data.clinicName)
    setIntake(data)
    const recommended = computeRecommendations(data)
    setRecommended(recommended)
    nextStep()
  }

  const fieldClass = 'w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-white text-sm font-body focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      {/* Clinic Name */}
      <div>
        <label htmlFor="clinicName" className={labelClass}>Clinic / Hospital Name *</label>
        <input id="clinicName" {...register('clinicName')} className={fieldClass} placeholder="e.g., SmileCare Dental Clinic" />
        {errors.clinicName && <p className="text-red-400 text-xs mt-1">{errors.clinicName.message}</p>}
      </div>

      {/* Clinic Type */}
      <div>
        <label className={labelClass}>Clinic Type *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CLINIC_TYPES.map(ct => (
            <label key={ct.value} className={clsx(
              'flex flex-col p-3 rounded-lg border cursor-pointer transition-all',
              watch('clinicType') === ct.value
                ? 'border-sage bg-sage/5'
                : 'border-dark-border bg-dark-card hover:border-dark-border/80',
            )}>
              <input type="radio" value={ct.value} {...register('clinicType')} className="sr-only" />
              <span className="text-sm font-medium text-white">{ct.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{ct.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Speciality & Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="speciality" className={labelClass}>Primary Speciality</label>
          <select id="speciality" {...register('speciality')} className={fieldClass}>
            {SPECIALITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="doctorCount" className={labelClass}>Number of Doctors</label>
          <select id="doctorCount" {...register('doctorCount')} className={fieldClass}>
            <option value="1">1</option>
            <option value="2-3">2–3</option>
            <option value="4-10">4–10</option>
            <option value="10+">10+</option>
          </select>
        </div>
        <div>
          <label htmlFor="dailyVolume" className={labelClass}>Daily Patient Volume</label>
          <select id="dailyVolume" {...register('dailyVolume')} className={fieldClass}>
            <option value="under10">Under 10</option>
            <option value="10-30">10–30</option>
            <option value="30-60">30–60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div>
          <label htmlFor="branchCount" className={labelClass}>Number of Branches</label>
          <select id="branchCount" {...register('branchCount')} className={fieldClass}>
            <option value="1">1</option>
            <option value="2-3">2–3</option>
            <option value="4+">4+</option>
          </select>
        </div>
        <div>
          <label htmlFor="staffSize" className={labelClass}>Staff Size</label>
          <select id="staffSize" {...register('staffSize')} className={fieldClass}>
            <option value="1-3">1–3</option>
            <option value="4-10">4–10</option>
            <option value="10+">10+</option>
          </select>
        </div>
      </div>

      {/* Boolean toggles */}
      <div>
        <label className={labelClass}>Existing Facilities</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'hasPharmacy' as const, label: 'In-house Pharmacy' },
            { name: 'hasLab' as const, label: 'Lab / Diagnostics' },
            { name: 'hasIPD' as const, label: 'In-Patient (IPD)' },
            { name: 'hasExistingHIS' as const, label: 'Existing HIS/EMR' },
          ].map(f => (
            <label key={f.name} className={clsx(
              'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm',
              watch(f.name) ? 'border-sage bg-sage/5 text-white' : 'border-dark-border bg-dark-card text-gray-400',
            )}>
              <input type="checkbox" {...register(f.name)} className="sr-only" />
              <div className={clsx('w-4 h-4 rounded border flex items-center justify-center text-xs',
                watch(f.name) ? 'bg-sage border-sage text-dark-base' : 'border-gray-600'
              )}>
                {watch(f.name) && '✓'}
              </div>
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <label className={labelClass}>Primary Goals * (select at least one)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOALS.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => toggleGoal(g.value)}
              className={clsx(
                'text-left p-3 rounded-lg border text-sm transition-all',
                (selectedGoals as string[]).includes(g.value)
                  ? 'border-sage bg-sage/10 text-white'
                  : 'border-dark-border bg-dark-card text-gray-400 hover:border-gray-600',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
        {errors.primaryGoals && <p className="text-red-400 text-xs mt-1">{errors.primaryGoals.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass}>Budget Range</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUDGET_BANDS.map(b => (
            <label key={b.value} className={clsx(
              'flex flex-col p-3 rounded-lg border cursor-pointer transition-all',
              watch('budgetBand') === b.value
                ? 'border-sage bg-sage/5'
                : 'border-dark-border bg-dark-card hover:border-gray-600',
            )}>
              <input type="radio" value={b.value} {...register('budgetBand')} className="sr-only" />
              <span className="text-sm font-medium text-white">{b.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{b.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className={labelClass}>Timeline Preference</label>
        <select id="timeline" {...register('timeline')} className={fieldClass}>
          <option value="asap">ASAP — as fast as possible</option>
          <option value="2-3months">2–3 months — comfortable pace</option>
          <option value="flexible">Flexible — no rush</option>
        </select>
      </div>

      <Button type="submit" size="lg" fullWidth>
        See My Smart Recommendations →
      </Button>
    </form>
  )
}

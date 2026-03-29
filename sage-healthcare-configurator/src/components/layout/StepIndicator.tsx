import { clsx } from 'clsx'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: 'Clinic Profile' },
  { num: 2, label: 'Module Selection' },
  { num: 3, label: 'Value Pitch' },
  { num: 4, label: 'Proposal' },
]

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-full text-sm font-mono font-semibold transition-all duration-300',
            currentStep === step.num
              ? 'bg-sage text-dark-base shadow-lg shadow-sage/30'
              : currentStep > step.num
                ? 'bg-sage/20 text-sage'
                : 'bg-dark-card text-gray-500 border border-dark-border',
          )}>
            {currentStep > step.num ? '✓' : step.num}
          </div>
          <span className={clsx(
            'text-sm font-body hidden sm:inline transition-colors',
            currentStep === step.num ? 'text-white font-medium' : 'text-gray-500',
          )}>
            {step.label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={clsx(
              'w-8 sm:w-16 h-px mx-1',
              currentStep > step.num ? 'bg-sage' : 'bg-dark-border',
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

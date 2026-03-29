import { useUIStore } from '@/store/uiStore'
import { StepIndicator } from '@/components/layout/StepIndicator'
import { IntakeForm } from '@/components/intake/IntakeForm'
import { CategorySidebar } from '@/components/configurator/CategorySidebar'
import { ModuleGrid } from '@/components/configurator/ModuleGrid'
import { PricingPanel } from '@/components/configurator/PricingPanel'
import { ModuleDetailDrawer } from '@/components/configurator/ModuleDetailDrawer'
import { ValuePitchScreen } from '@/components/valuePitch/ValuePitchScreen'
import { ProposalScreen } from '@/components/proposal/ProposalScreen'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { Button } from '@/components/ui/Button'
import { usePricingEngine } from '@/hooks/usePricingEngine'
import { formatINR } from '@/utils/formatCurrency'
import { Search, RotateCcw } from 'lucide-react'

export default function ConfigurePage() {
  const { currentStep, searchQuery, setSearchQuery, nextStep, prevStep } = useUIStore()
  const { resetToRecommended } = useConfiguratorStore()
  const pricing = usePricingEngine()

  return (
    <div className="min-h-screen bg-dark-base">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Intake */}
        {currentStep === 1 && (
          <div className="py-8">
            <h1 className="font-display text-3xl text-center text-white mb-2">Tell Us About Your Clinic</h1>
            <p className="text-center text-gray-400 mb-10">We&rsquo;ll recommend the right modules based on your answers.</p>
            <IntakeForm />
          </div>
        )}

        {/* Step 2: Configurator */}
        {currentStep === 2 && (
          <div className="py-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  ← Back
                </Button>
                <Button variant="ghost" size="sm" onClick={resetToRecommended}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset to recommendations
                </Button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full bg-dark-card border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sage"
                  aria-label="Search modules"
                />
              </div>
            </div>

            {/* 3-column layout */}
            <div className="flex gap-6">
              <CategorySidebar />
              <ModuleGrid />
              <PricingPanel />
            </div>

            {/* Mobile pricing bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-dark-panel/95 backdrop-blur-lg border-t border-dark-border p-4 flex items-center justify-between xl:hidden z-30">
              <div>
                <p className="font-mono text-xl text-sage font-bold">{formatINR(pricing.totalOneTime)}</p>
                <p className="text-xs text-gray-500">{pricing.moduleCount} modules selected</p>
              </div>
              <Button size="sm" onClick={nextStep} disabled={pricing.moduleCount === 0}>
                Continue →
              </Button>
            </div>

            <ModuleDetailDrawer />
          </div>
        )}

        {/* Step 3: Value Pitch */}
        {currentStep === 3 && <ValuePitchScreen />}

        {/* Step 4: Proposal */}
        {currentStep === 4 && <ProposalScreen />}
      </div>
    </div>
  )
}

import { MODULES } from '@/data/modules'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/utils/formatCurrency'
import { X, Check } from 'lucide-react'
import { useModuleDependencies } from '@/hooks/useModuleDependencies'

export const ModuleDetailDrawer = () => {
  const { drawerModuleId, closeDrawer } = useUIStore()
  const { selectedModuleIds, toggleModule } = useConfiguratorStore()
  const { enforceOnAdd } = useModuleDependencies()

  if (!drawerModuleId) return null

  const module = MODULES.find(m => m.id === drawerModuleId)
  if (!module) return null

  const isSelected = selectedModuleIds.has(module.id)

  const handleToggle = () => {
    if (!isSelected) {
      toggleModule(module.id)
      enforceOnAdd(module.id)
    } else {
      toggleModule(module.id)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={closeDrawer} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-sidebar border-l border-dark-border z-50 overflow-y-auto animate-slide-in-right">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <DynamicIcon name={module.icon} size={24} className="text-sage" />
              <div>
                <h2 className="font-display text-xl text-white">{module.name}</h2>
                <div className="flex gap-2 mt-1">
                  <Badge variant={module.badge as 'recommended' | 'advanced' | 'optional'}>{module.badge}</Badge>
                  <span className="text-xs text-gray-500">{module.complexity} complexity</span>
                </div>
              </div>
            </div>
            <button onClick={closeDrawer} className="text-gray-500 hover:text-white" aria-label="Close drawer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed">{module.description}</p>

          {/* Client Value */}
          <div className="bg-sage/5 border border-sage/20 rounded-lg p-4">
            <p className="text-xs text-sage uppercase tracking-wider mb-1">Why you need this</p>
            <p className="text-sm text-white italic">{module.clientValue}</p>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Features Included</p>
            <ul className="space-y-2">
              {module.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="flex gap-4">
            <div className="bg-dark-card rounded-lg p-3 flex-1 text-center">
              <p className="text-xs text-gray-500">Timeline</p>
              <p className="font-mono text-white">{module.weeksMin}–{module.weeksMax} weeks</p>
            </div>
            <div className="bg-dark-card rounded-lg p-3 flex-1 text-center">
              <p className="text-xs text-gray-500">SaaS Alt.</p>
              <p className="font-mono text-gold">{formatINR(module.saasLow)}–{formatINR(module.saasHigh)}/mo</p>
            </div>
          </div>

          {/* Price */}
          <div className="text-center border-t border-dark-border pt-4">
            <p className="text-xs text-gray-500 mb-1">One-Time Investment</p>
            <p className="font-mono text-3xl text-sage font-bold">{formatINR(module.oneTime)}</p>
          </div>

          {/* Toggle */}
          <Button fullWidth size="lg" variant={isSelected ? 'danger' : 'primary'} onClick={handleToggle}>
            {isSelected ? 'Remove from Selection' : 'Add to Selection'}
          </Button>
        </div>
      </div>
    </>
  )
}

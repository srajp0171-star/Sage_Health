import type { Module } from '@/types'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useUIStore } from '@/store/uiStore'
import { useModuleDependencies } from '@/hooks/useModuleDependencies'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { formatINR } from '@/utils/formatCurrency'
import { CATEGORIES } from '@/data/categories'
import { clsx } from 'clsx'

interface ModuleCardProps {
  module: Module
  index: number
}

const CATEGORY_COLORS: Record<string, string> = {
  base:        'bg-sage',
  operational: 'bg-blue-400',
  patient:     'bg-red-400',
  telemedicine:'bg-green-400',
  business:    'bg-gold',
  access:      'bg-yellow-600',
}

export const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const { selectedModuleIds, toggleModule, recommendedIds } = useConfiguratorStore()
  const { openDrawer } = useUIStore()
  const { enforceOnAdd, checkOnRemove } = useModuleDependencies()
  const { addToast } = useUIStore()

  const isSelected = selectedModuleIds.has(module.id)
  const isRecommended = recommendedIds.has(module.id)

  const handleToggle = (checked: boolean) => {
    if (checked) {
      toggleModule(module.id)
      enforceOnAdd(module.id)
    } else {
      const warning = checkOnRemove(module.id)
      if (warning) addToast({ type: 'warning', message: warning })
      toggleModule(module.id)
    }
  }

  const catColor = CATEGORY_COLORS[module.category] ?? 'bg-gray-500'

  return (
    <div
      className={clsx(
        'relative bg-dark-card border rounded-xl overflow-hidden transition-all duration-300 group',
        isSelected
          ? 'border-sage/60 bg-dark-hover shadow-lg shadow-sage/5 border-l-4 border-l-sage'
          : 'border-dark-border hover:border-dark-border/80',
        isRecommended && !isSelected && 'animate-pulse-glow',
      )}
      style={{ animationDelay: `${index * 50}ms`, animationIterationCount: isRecommended && !isSelected ? 3 : 0 }}
    >
      {/* Top color bar */}
      <div className={clsx('h-1 w-full', catColor)} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <DynamicIcon name={module.icon} size={18} className="text-gray-400" />
            <Badge variant={module.badge as 'recommended' | 'advanced' | 'optional'}>
              {module.badge}
            </Badge>
          </div>
        </div>

        {/* Name */}
        <h3
          className="font-display text-base text-white mb-1 cursor-pointer hover:text-sage transition-colors"
          onClick={() => openDrawer(module.id)}
        >
          {module.name}
        </h3>

        {/* Client value */}
        <p className="text-sage text-xs italic mb-2 leading-relaxed">{module.clientValue}</p>

        {/* Description */}
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{module.description}</p>

        <div className="border-t border-dark-border pt-3 flex items-center justify-between">
          <Toggle
            checked={isSelected}
            onChange={handleToggle}
            label={`Toggle ${module.name}`}
          />
          <span className="font-mono text-lg text-white font-semibold">
            {formatINR(module.oneTime)}
          </span>
        </div>
      </div>
    </div>
  )
}

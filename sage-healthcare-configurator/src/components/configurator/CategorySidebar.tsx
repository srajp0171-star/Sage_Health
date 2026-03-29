import { CATEGORIES } from '@/data/categories'
import { useUIStore } from '@/store/uiStore'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { MODULES } from '@/data/modules'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import { clsx } from 'clsx'

export const CategorySidebar = () => {
  const { activeCategory, setActiveCategory } = useUIStore()
  const selectedModuleIds = useConfiguratorStore(s => s.selectedModuleIds)

  return (
    <aside className="w-56 shrink-0 hidden lg:block sticky top-20 h-fit">
      <nav className="space-y-1">
        {CATEGORIES.map(cat => {
          const count = MODULES.filter(m => m.category === cat.id && selectedModuleIds.has(m.id)).length
          const total = MODULES.filter(m => m.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left',
                activeCategory === cat.id
                  ? 'bg-sage/10 text-sage border border-sage/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card',
              )}
              aria-label={`Show ${cat.label} modules`}
            >
              <DynamicIcon name={cat.icon} size={16} />
              <span className="flex-1 truncate">{cat.label}</span>
              <span className={clsx(
                'text-xs font-mono px-1.5 py-0.5 rounded',
                count > 0 ? 'bg-sage/20 text-sage' : 'text-gray-600',
              )}>
                {count}/{total}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

import { MODULES } from '@/data/modules'
import { CATEGORIES } from '@/data/categories'
import { useUIStore } from '@/store/uiStore'
import { ModuleCard } from './ModuleCard'

export const ModuleGrid = () => {
  const { activeCategory, searchQuery } = useUIStore()

  const filtered = MODULES.filter(m => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    }
    return m.category === activeCategory
  })

  const groupedByCategory = searchQuery
    ? CATEGORIES.filter(c => filtered.some(m => m.category === c.id))
    : CATEGORIES.filter(c => c.id === activeCategory)

  return (
    <div className="flex-1 min-w-0 space-y-8">
      {groupedByCategory.map(cat => {
        const modules = filtered.filter(m => m.category === cat.id)
        if (modules.length === 0) return null

        return (
          <section key={cat.id} id={`cat-${cat.id}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <h2 className="font-display text-lg text-white">{cat.label}</h2>
              <span className="text-xs text-gray-500">— {cat.description}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((m, i) => (
                <ModuleCard key={m.id} module={m} index={i} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

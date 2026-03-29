import { useMemo } from 'react'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { MODULES } from '@/data/modules'
import { PRICING_RULES } from '@/data/pricingRules'
import { generateTimeline, computeTotalWeeks } from '@/utils/timelineGenerator'
import type { Module, Phase } from '@/types'

export interface PricingResult {
  selectedModules:    Module[]
  moduleCount:        number
  subtotal:           number
  appliedBundle:      { name: string; discountPct: number; saving: number } | null
  volumeDiscount:     { label: string; discountPct: number; saving: number } | null
  totalDiscount:      number
  totalOneTime:       number
  gstAmount:          number
  grandTotal:         number
  monthlyEquiv:       number
  saasMonthlyLow:     number
  saasMonthlyHigh:    number
  savings5yrLow:      number
  savings5yrHigh:     number
  paymentMilestones:  { label: string; pct: number; amount: number }[]
  phases:             Phase[]
  totalWeeks:         { min: number; max: number }
  budgetStatus:       'under' | 'within' | 'over'
  budgetDelta:        number
  breakEvenMonth:     number
}

export const usePricingEngine = (): PricingResult => {
  const selectedArray = useConfiguratorStore(s => [...s.selectedModuleIds].sort().join(','))
  const customPrices  = useConfiguratorStore(s => s.customPrices)
  const budgetBand    = useConfiguratorStore(s => s.intake.budgetBand)
  const getBudgetLimit = useConfiguratorStore(s => s.getBudgetLimit)
  const amortMonths   = PRICING_RULES.defaultAmortizationMonths
  const gstPct        = PRICING_RULES.gstPct

  return useMemo(() => {
    const selectedIds = new Set(selectedArray ? selectedArray.split(',') : [])

    const selectedModules: Module[] = MODULES
      .filter(m => selectedIds.has(m.id))
      .map(m => ({
        ...m,
        oneTime: customPrices[m.id] !== undefined ? customPrices[m.id] : m.oneTime,
      }))

    const subtotal = selectedModules.reduce((sum, m) => sum + m.oneTime, 0)

    // Bundle discount
    let appliedBundle: PricingResult['appliedBundle'] = null
    if (PRICING_RULES.bundles) {
      const matchingBundles = PRICING_RULES.bundles.filter(b =>
        b.moduleIds.every(id => selectedIds.has(id))
      )
      if (matchingBundles.length > 0) {
        const best = matchingBundles.reduce((a, b) =>
          b.discountPct > a.discountPct ? b : a
        )
        appliedBundle = {
          name:        best.name,
          discountPct: best.discountPct,
          saving:      Math.round(subtotal * best.discountPct / 100),
        }
      }
    }

    // Volume discount
    let volumeDiscount: PricingResult['volumeDiscount'] = null
    const afterBundle = subtotal - (appliedBundle?.saving ?? 0)
    if (PRICING_RULES.volumeDiscounts) {
      const match = PRICING_RULES.volumeDiscounts.find(
        v => afterBundle >= v.minTotal && afterBundle <= v.maxTotal
      )
      if (match) {
        volumeDiscount = {
          label:       match.label,
          discountPct: match.discountPct,
          saving:      Math.round(afterBundle * match.discountPct / 100),
        }
      }
    }

    const totalDiscount = (appliedBundle?.saving ?? 0) + (volumeDiscount?.saving ?? 0)
    const totalOneTime  = Math.max(0, subtotal - totalDiscount)
    const gstAmount     = PRICING_RULES.showGstSeparately
                          ? Math.round(totalOneTime * gstPct / 100)
                          : 0
    const grandTotal    = totalOneTime + gstAmount

    const saasMonthlyLow  = selectedModules.reduce((s, m) => s + m.saasLow, 0)
    const saasMonthlyHigh = selectedModules.reduce((s, m) => s + m.saasHigh, 0)
    const savings5yrLow   = Math.max(0, saasMonthlyLow  * 60 - grandTotal)
    const savings5yrHigh  = Math.max(0, saasMonthlyHigh * 60 - grandTotal)

    const breakEvenMonth = saasMonthlyLow > 0
      ? Math.ceil(grandTotal / saasMonthlyLow)
      : 0

    const [p1, p2, p3] = [40, 40, 20]
    const paymentMilestones = [
      { label: 'On project start',   pct: p1, amount: Math.round(grandTotal * p1 / 100) },
      { label: 'After UAT approval', pct: p2, amount: Math.round(grandTotal * p2 / 100) },
      { label: 'On go-live',         pct: p3, amount: Math.round(grandTotal * p3 / 100) },
    ]

    const phases     = generateTimeline({ selectedModules })
    const totalWeeks = computeTotalWeeks(phases)

    const budget      = getBudgetLimit()
    const budgetDelta = grandTotal - budget
    const budgetStatus: PricingResult['budgetStatus'] =
      budget === Infinity      ? 'within' :
      budgetDelta > 20000      ? 'over'   :
      budgetDelta < -10000     ? 'under'  : 'within'

    return {
      selectedModules,
      moduleCount:    selectedModules.length,
      subtotal,
      appliedBundle,
      volumeDiscount,
      totalDiscount,
      totalOneTime,
      gstAmount,
      grandTotal,
      monthlyEquiv:   Math.round(totalOneTime / amortMonths / 100) * 100,
      saasMonthlyLow,
      saasMonthlyHigh,
      savings5yrLow,
      savings5yrHigh,
      paymentMilestones,
      phases,
      totalWeeks,
      budgetStatus,
      budgetDelta,
      breakEvenMonth,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArray, customPrices, budgetBand])
}

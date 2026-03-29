import { useState, useCallback } from 'react'
import { sanitizeFilename, formatDateForFilename } from '@/utils/formatCurrency'
import { logger } from '@/utils/logger'

interface UsePdfExportOptions {
  elementId:  string
  clinicName: string
}

interface UsePdfExportReturn {
  isGenerating: boolean
  exportPdf:    () => Promise<void>
  error:        string | null
}

export const usePdfExport = ({ elementId, clinicName }: UsePdfExportOptions): UsePdfExportReturn => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  const exportPdf = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const element = document.getElementById(elementId)
      if (!element) throw new Error(`Element #${elementId} not found`)

      element.classList.add('pdf-mode')
      await new Promise(resolve => setTimeout(resolve, 300))

      const canvas = await html2canvas(element, {
        scale:           2,
        useCORS:         true,
        allowTaint:      false,
        backgroundColor: '#FFFFFF',
        logging:         false,
        windowWidth:     element.scrollWidth,
        windowHeight:    element.scrollHeight,
      })

      element.classList.remove('pdf-mode')

      const A4_WIDTH_MM  = 210
      const A4_HEIGHT_MM = 297
      const MARGIN_MM    = 10
      const printWidth   = A4_WIDTH_MM - MARGIN_MM * 2

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const canvasWidth  = canvas.width
      const canvasHeight = canvas.height
      const ratio        = printWidth / (canvasWidth / 2)

      const pageHeightPx = (A4_HEIGHT_MM - MARGIN_MM * 2) / ratio * 2

      let yOffset = 0
      let pageNum = 0

      while (yOffset < canvasHeight) {
        if (pageNum > 0) pdf.addPage()

        const sliceCanvas  = document.createElement('canvas')
        const sliceHeight  = Math.min(pageHeightPx, canvasHeight - yOffset)
        sliceCanvas.width  = canvasWidth
        sliceCanvas.height = sliceHeight

        const ctx = sliceCanvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context unavailable')

        ctx.drawImage(canvas, 0, -yOffset)

        const sliceData = sliceCanvas.toDataURL('image/png')
        const sliceHeightMm = (sliceHeight / 2) * ratio

        pdf.addImage(sliceData, 'PNG', MARGIN_MM, MARGIN_MM, printWidth, sliceHeightMm)

        yOffset += pageHeightPx
        pageNum++
      }

      const safeName = sanitizeFilename(clinicName) || 'Client'
      const dateStr  = formatDateForFilename()
      pdf.save(`SageTech_Proposal_${safeName}_${dateStr}.pdf`)

      logger.log('PDF generated successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PDF generation failed'
      setError(message)
      logger.error('PDF export error:', err)
      document.getElementById(elementId)?.classList.remove('pdf-mode')
    } finally {
      setIsGenerating(false)
    }
  }, [elementId, clinicName])

  return { isGenerating, exportPdf, error }
}

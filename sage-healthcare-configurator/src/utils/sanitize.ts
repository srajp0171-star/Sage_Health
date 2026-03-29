export const stripHtml = (input: string): string => {
  return input.replace(/<[^>]*>/g, '').trim()
}

export const sanitizeText = (input: string): string => {
  return stripHtml(input)
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export const sanitizeClinicName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9\s\-\.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

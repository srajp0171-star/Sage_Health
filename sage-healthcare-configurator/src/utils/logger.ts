const isDev = import.meta.env.DEV

export const logger = {
  log:   (...args: unknown[]) => { if (isDev) console.log('[STS]', ...args) },
  warn:  (...args: unknown[]) => { if (isDev) console.warn('[STS]', ...args) },
  error: (...args: unknown[]) => { if (isDev) console.error('[STS]', ...args) },
  info:  (...args: unknown[]) => { if (isDev) console.info('[STS]', ...args) },
}

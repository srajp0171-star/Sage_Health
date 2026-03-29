const ADMIN_SESSION_KEY = 'sts_admin_v1'

export const checkAdminAuth = (): boolean => {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export const setAdminAuth = (value: boolean): void => {
  try {
    if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
    else sessionStorage.removeItem(ADMIN_SESSION_KEY)
  } catch {
    // sessionStorage blocked
  }
}

export const verifyPassword = (input: string): boolean => {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD
  if (!expected) return false
  return input === expected
}

import { QueryFailedError } from 'typeorm'

// Postgres: code 23505. SQLite: "UNIQUE constraint failed".
export const isUniqueViolation = (e: unknown): boolean => {
  if (!(e instanceof QueryFailedError)) return false
  const driver = e.driverError as { code?: string; message?: string } | undefined
  return driver?.code === '23505' || /UNIQUE constraint failed/i.test(driver?.message ?? e.message)
}

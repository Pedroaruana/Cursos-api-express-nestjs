import { z } from 'zod'

export const idParam = z.object({ id: z.coerce.number().int().positive() })

export const pagination = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

export const toSkipTake = ({ page, limit }: { page?: number; limit?: number }) => {
  if (!page && !limit) return {}
  const take = limit ?? 10
  return { skip: ((page ?? 1) - 1) * take, take }
}

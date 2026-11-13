import { z } from 'zod'
import { pagination } from './common'

export const courseBody = z.object({
  title: z.string().trim().min(3, 'title deve ter ao menos 3 caracteres'),
  category: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
})

export const courseQuery = pagination.extend({ category: z.string().trim().min(1).optional() })

export type CourseInput = z.infer<typeof courseBody>

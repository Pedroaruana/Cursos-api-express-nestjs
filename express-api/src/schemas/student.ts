import { z } from 'zod'
import { pagination } from './common'

export const studentBody = z.object({
  name: z.string().trim().min(1, 'name obrigatorio'),
  email: z.string().trim().toLowerCase().email('email invalido'),
})

export const studentQuery = pagination

export type StudentInput = z.infer<typeof studentBody>

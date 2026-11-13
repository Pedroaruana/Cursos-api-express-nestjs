import { z } from 'zod'

export const enrollmentBody = z.object({
  studentId: z.number().int().positive(),
  courseId: z.number().int().positive(),
})

export type EnrollmentInput = z.infer<typeof enrollmentBody>

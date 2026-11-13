import { prisma } from '../lib/prisma'
import type { EnrollmentInput } from '../schemas/enrollment'

export const enrollmentsRepository = {
  create: (data: EnrollmentInput) => prisma.enrollment.create({ data }),
  findByPair: (studentId: number, courseId: number) =>
    prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId } } }),
  listByStudent: (studentId: number) =>
    prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { id: 'asc' },
    }),
  delete: (id: number) => prisma.enrollment.delete({ where: { id } }),
}

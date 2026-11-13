import { prisma } from '../lib/prisma'
import type { StudentInput } from '../schemas/student'

export const studentsRepository = {
  create: (data: StudentInput) => prisma.student.create({ data }),
  list: (page: { skip?: number; take?: number }) =>
    prisma.$transaction([prisma.student.findMany({ orderBy: { id: 'asc' }, ...page }), prisma.student.count()]),
  findById: (id: number) => prisma.student.findUnique({ where: { id } }),
  update: (id: number, data: StudentInput) => prisma.student.update({ where: { id }, data }),
  delete: (id: number) => prisma.student.delete({ where: { id } }),
}

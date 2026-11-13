import { prisma } from '../lib/prisma'
import type { CourseInput } from '../schemas/course'

export const coursesRepository = {
  create: (data: CourseInput) => prisma.course.create({ data }),
  list: (where: { category?: string }, page: { skip?: number; take?: number }) =>
    prisma.$transaction([
      prisma.course.findMany({ where, orderBy: { id: 'asc' }, ...page }),
      prisma.course.count({ where }),
    ]),
  findById: (id: number) => prisma.course.findUnique({ where: { id } }),
  update: (id: number, data: CourseInput) => prisma.course.update({ where: { id }, data }),
  delete: (id: number) => prisma.course.delete({ where: { id } }),
}

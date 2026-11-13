import { notFound } from '../errors/AppError'
import { isPrismaError, PRISMA_NOT_FOUND } from '../lib/prismaErrors'
import { coursesRepository } from '../repositories/courses.repository'
import type { CourseInput } from '../schemas/course'

const rethrowNotFound = (e: unknown): never => {
  if (isPrismaError(e, PRISMA_NOT_FOUND)) throw notFound('Curso')
  throw e
}

export const coursesService = {
  create: (data: CourseInput) => coursesRepository.create(data),
  list: (category: string | undefined, page: { skip?: number; take?: number }) =>
    coursesRepository.list(category ? { category } : {}, page),
  get: async (id: number) => {
    const course = await coursesRepository.findById(id)
    if (!course) throw notFound('Curso')
    return course
  },
  update: (id: number, data: CourseInput) => coursesRepository.update(id, data).catch(rethrowNotFound),
  remove: async (id: number) => {
    await coursesRepository.delete(id).catch(rethrowNotFound)
  },
}

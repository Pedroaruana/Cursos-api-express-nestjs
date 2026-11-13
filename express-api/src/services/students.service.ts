import { AppError, notFound } from '../errors/AppError'
import { isPrismaError, PRISMA_NOT_FOUND, PRISMA_UNIQUE } from '../lib/prismaErrors'
import { studentsRepository } from '../repositories/students.repository'
import type { StudentInput } from '../schemas/student'

const mapError = (e: unknown): never => {
  if (isPrismaError(e, PRISMA_UNIQUE)) throw new AppError(409, 'email ja cadastrado')
  if (isPrismaError(e, PRISMA_NOT_FOUND)) throw notFound('Estudante')
  throw e
}

export const studentsService = {
  create: (data: StudentInput) => studentsRepository.create(data).catch(mapError),
  list: (page: { skip?: number; take?: number }) => studentsRepository.list(page),
  get: async (id: number) => {
    const student = await studentsRepository.findById(id)
    if (!student) throw notFound('Estudante')
    return student
  },
  update: (id: number, data: StudentInput) => studentsRepository.update(id, data).catch(mapError),
  remove: async (id: number) => {
    await studentsRepository.delete(id).catch(mapError)
  },
}

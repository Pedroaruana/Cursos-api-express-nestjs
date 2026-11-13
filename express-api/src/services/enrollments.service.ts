import { AppError, notFound } from '../errors/AppError'
import { isPrismaError, PRISMA_FK, PRISMA_NOT_FOUND, PRISMA_UNIQUE } from '../lib/prismaErrors'
import { coursesRepository } from '../repositories/courses.repository'
import { enrollmentsRepository } from '../repositories/enrollments.repository'
import { studentsRepository } from '../repositories/students.repository'
import type { EnrollmentInput } from '../schemas/enrollment'

const duplicated = () => new AppError(409, 'estudante ja matriculado neste curso')

export const enrollmentsService = {
  create: async (data: EnrollmentInput) => {
    if (!(await studentsRepository.findById(data.studentId))) throw notFound('Estudante')
    if (!(await coursesRepository.findById(data.courseId))) throw notFound('Curso')
    if (await enrollmentsRepository.findByPair(data.studentId, data.courseId)) throw duplicated()
    try {
      return await enrollmentsRepository.create(data)
    } catch (e) {
      // requisicoes simultaneas iguais: a constraint unica segura
      if (isPrismaError(e, PRISMA_UNIQUE)) throw duplicated()
      if (isPrismaError(e, PRISMA_FK)) throw notFound('Estudante ou curso')
      throw e
    }
  },
  listByStudent: async (studentId: number) => {
    if (!(await studentsRepository.findById(studentId))) throw notFound('Estudante')
    return enrollmentsRepository.listByStudent(studentId)
  },
  remove: async (id: number) => {
    await enrollmentsRepository.delete(id).catch((e) => {
      if (isPrismaError(e, PRISMA_NOT_FOUND)) throw notFound('Matricula')
      throw e
    })
  },
}

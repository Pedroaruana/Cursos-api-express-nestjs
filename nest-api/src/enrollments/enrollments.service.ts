import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { isUniqueViolation } from '../common/db-errors.js'
import { CoursesRepository } from '../courses/courses.repository.js'
import { StudentsRepository } from '../students/students.repository.js'
import { EnrollmentDto } from './dto/enrollment.dto.js'
import { EnrollmentsRepository } from './enrollments.repository.js'

const duplicated = () => new ConflictException('estudante ja matriculado neste curso')

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollments: EnrollmentsRepository,
    private readonly students: StudentsRepository,
    private readonly courses: CoursesRepository,
  ) {}

  async create(dto: EnrollmentDto) {
    if (!(await this.students.findById(dto.studentId))) throw new NotFoundException('Estudante nao encontrado')
    if (!(await this.courses.findById(dto.courseId))) throw new NotFoundException('Curso nao encontrado')
    if (await this.enrollments.findByPair(dto.studentId, dto.courseId)) throw duplicated()
    try {
      return await this.enrollments.create(dto)
    } catch (e) {
      // requisicoes simultaneas iguais: a constraint unica segura
      throw isUniqueViolation(e) ? duplicated() : e
    }
  }

  async listByStudent(studentId: number) {
    if (!(await this.students.findById(studentId))) throw new NotFoundException('Estudante nao encontrado')
    return this.enrollments.listByStudent(studentId)
  }

  async remove(id: number) {
    if (!(await this.enrollments.delete(id))) throw new NotFoundException('Matricula nao encontrada')
  }
}

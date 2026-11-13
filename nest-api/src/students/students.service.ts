import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { isUniqueViolation } from '../common/db-errors.js'
import { PaginationQueryDto, toSkipTake } from '../common/pagination.js'
import { StudentDto } from './dto/student.dto.js'
import { StudentsRepository } from './students.repository.js'
import type { Student } from './student.entity.js'

const emailTaken = () => new ConflictException('email ja cadastrado')

@Injectable()
export class StudentsService {
  constructor(private readonly students: StudentsRepository) {}

  async create(dto: StudentDto) {
    if (await this.students.findByEmail(dto.email)) throw emailTaken()
    try {
      return await this.students.create(dto)
    } catch (e) {
      // requisicoes simultaneas: a constraint unica do banco segura
      throw isUniqueViolation(e) ? emailTaken() : e
    }
  }

  list(query: PaginationQueryDto) {
    return this.students.findAndCount(toSkipTake(query))
  }

  async get(id: number) {
    const student = await this.students.findById(id)
    if (!student) throw new NotFoundException('Estudante nao encontrado')
    return student
  }

  async update(id: number, dto: StudentDto) {
    const student = await this.get(id)
    const other = await this.students.findByEmail(dto.email)
    if (other && other.id !== id) throw emailTaken()
    return this.save(Object.assign(student, dto))
  }

  async remove(id: number) {
    if (!(await this.students.delete(id))) throw new NotFoundException('Estudante nao encontrado')
  }

  private async save(student: Student) {
    try {
      return await this.students.save(student)
    } catch (e) {
      throw isUniqueViolation(e) ? emailTaken() : e
    }
  }
}

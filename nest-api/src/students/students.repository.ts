import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentDto } from './dto/student.dto.js'
import { Student } from './student.entity.js'

@Injectable()
export class StudentsRepository {
  constructor(@InjectRepository(Student) private readonly repo: Repository<Student>) {}

  create(data: StudentDto) {
    return this.repo.save(this.repo.create(data))
  }

  findAndCount(page: { skip?: number; take?: number }) {
    return this.repo.findAndCount({ order: { id: 'ASC' }, ...page })
  }

  findById(id: number) {
    return this.repo.findOneBy({ id })
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email })
  }

  save(student: Student) {
    return this.repo.save(student)
  }

  async delete(id: number) {
    const result = await this.repo.delete(id)
    return (result.affected ?? 0) > 0
  }
}

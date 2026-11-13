import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EnrollmentDto } from './dto/enrollment.dto.js'
import { Enrollment } from './enrollment.entity.js'

@Injectable()
export class EnrollmentsRepository {
  constructor(@InjectRepository(Enrollment) private readonly repo: Repository<Enrollment>) {}

  create(data: EnrollmentDto) {
    return this.repo.save(this.repo.create(data))
  }

  findByPair(studentId: number, courseId: number) {
    return this.repo.findOneBy({ studentId, courseId })
  }

  listByStudent(studentId: number) {
    return this.repo.find({ where: { studentId }, relations: { course: true }, order: { id: 'ASC' } })
  }

  async delete(id: number) {
    const result = await this.repo.delete(id)
    return (result.affected ?? 0) > 0
  }
}

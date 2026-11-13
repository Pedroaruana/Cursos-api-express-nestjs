import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from './course.entity.js'
import { CourseDto } from './dto/course.dto.js'

@Injectable()
export class CoursesRepository {
  constructor(@InjectRepository(Course) private readonly repo: Repository<Course>) {}

  create(data: CourseDto) {
    return this.repo.save(this.repo.create(data))
  }

  findAndCount(category: string | undefined, page: { skip?: number; take?: number }) {
    return this.repo.findAndCount({ where: category ? { category } : {}, order: { id: 'ASC' }, ...page })
  }

  findById(id: number) {
    return this.repo.findOneBy({ id })
  }

  save(course: Course) {
    return this.repo.save(course)
  }

  async delete(id: number) {
    const result = await this.repo.delete(id)
    return (result.affected ?? 0) > 0
  }
}

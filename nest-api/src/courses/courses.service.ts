import { Injectable, NotFoundException } from '@nestjs/common'
import { toSkipTake } from '../common/pagination.js'
import { CoursesRepository } from './courses.repository.js'
import { CourseDto, ListCoursesQueryDto } from './dto/course.dto.js'

@Injectable()
export class CoursesService {
  constructor(private readonly courses: CoursesRepository) {}

  create(dto: CourseDto) {
    return this.courses.create(dto)
  }

  list({ category, ...page }: ListCoursesQueryDto) {
    return this.courses.findAndCount(category, toSkipTake(page))
  }

  async get(id: number) {
    const course = await this.courses.findById(id)
    if (!course) throw new NotFoundException('Curso nao encontrado')
    return course
  }

  async update(id: number, dto: CourseDto) {
    const course = await this.get(id)
    return this.courses.save(Object.assign(course, dto))
  }

  async remove(id: number) {
    if (!(await this.courses.delete(id))) throw new NotFoundException('Curso nao encontrado')
  }
}

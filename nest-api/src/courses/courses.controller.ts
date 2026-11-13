import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { CoursesService } from './courses.service.js'
import { CourseDto, ListCoursesQueryDto } from './dto/course.dto.js'

const IdPipe = new ParseIntPipe({ errorHttpStatusCode: 422 })

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post()
  create(@Body() dto: CourseDto) {
    return this.service.create(dto)
  }

  @Get()
  async list(@Query() query: ListCoursesQueryDto, @Res({ passthrough: true }) res: Response) {
    const [data, total] = await this.service.list(query)
    res.set('X-Total-Count', String(total))
    return data
  }

  @Get(':id')
  get(@Param('id', IdPipe) id: number) {
    return this.service.get(id)
  }

  @Put(':id')
  update(@Param('id', IdPipe) id: number, @Body() dto: CourseDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.service.remove(id)
  }
}

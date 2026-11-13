import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { PaginationQueryDto } from '../common/pagination.js'
import { StudentDto } from './dto/student.dto.js'
import { StudentsService } from './students.service.js'

const IdPipe = new ParseIntPipe({ errorHttpStatusCode: 422 })

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  create(@Body() dto: StudentDto) {
    return this.service.create(dto)
  }

  @Get()
  async list(@Query() query: PaginationQueryDto, @Res({ passthrough: true }) res: Response) {
    const [data, total] = await this.service.list(query)
    res.set('X-Total-Count', String(total))
    return data
  }

  @Get(':id')
  get(@Param('id', IdPipe) id: number) {
    return this.service.get(id)
  }

  @Put(':id')
  update(@Param('id', IdPipe) id: number, @Body() dto: StudentDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.service.remove(id)
  }
}

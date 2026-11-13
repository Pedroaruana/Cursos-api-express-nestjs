import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EnrollmentDto } from './dto/enrollment.dto.js'
import { EnrollmentsService } from './enrollments.service.js'

const IdPipe = new ParseIntPipe({ errorHttpStatusCode: 422 })

@ApiTags('Enrollments')
@Controller()
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post('enrollments')
  create(@Body() dto: EnrollmentDto) {
    return this.service.create(dto)
  }

  @Delete('enrollments/:id')
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.service.remove(id)
  }

  @Get('students/:id/enrollments')
  listByStudent(@Param('id', IdPipe) id: number) {
    return this.service.listByStudent(id)
  }
}

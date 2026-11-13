import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class EnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  studentId: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  courseId: number
}

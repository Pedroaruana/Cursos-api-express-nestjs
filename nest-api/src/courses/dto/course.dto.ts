import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { PaginationQueryDto } from '../../common/pagination.js'

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class CourseDto {
  @ApiProperty({ minLength: 3, example: 'Node.js do zero' })
  @Transform(trim)
  @IsString()
  @MinLength(3, { message: 'title deve ter ao menos 3 caracteres' })
  title: string

  @ApiPropertyOptional({ example: 'backend' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}

export class ListCoursesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'filtra por categoria' })
  @IsOptional()
  @IsString()
  category?: string
}

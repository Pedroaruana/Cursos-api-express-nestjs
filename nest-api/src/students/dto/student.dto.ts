import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class StudentDto {
  @ApiProperty({ example: 'Ana Souza' })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'name obrigatorio' })
  name: string

  @ApiProperty({ example: 'ana@example.com' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'email invalido' })
  email: string
}

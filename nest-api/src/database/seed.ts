import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { AppModule } from '../app.module.js'
import { Course } from '../courses/course.entity.js'
import { Student } from '../students/student.entity.js'

const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error'] })

const courses = app.get<Repository<Course>>(getRepositoryToken(Course))
const students = app.get<Repository<Student>>(getRepositoryToken(Student))

for (const data of [
  { title: 'Node.js do zero', category: 'backend', description: 'APIs REST com Node' },
  { title: 'React na pratica', category: 'frontend', description: 'Componentes e hooks' },
  { title: 'Banco de dados SQL', category: 'dados', description: 'Modelagem e consultas' },
]) {
  if (!(await courses.findOneBy({ title: data.title }))) await courses.save(courses.create(data))
}

for (const data of [
  { name: 'Ana Souza', email: 'ana@example.com' },
  { name: 'Bruno Lima', email: 'bruno@example.com' },
]) {
  if (!(await students.findOneBy({ email: data.email }))) await students.save(students.create(data))
}

await app.close()
console.log('seed ok')

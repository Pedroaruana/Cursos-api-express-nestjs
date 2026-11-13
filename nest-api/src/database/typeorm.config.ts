import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Course } from '../courses/course.entity.js'
import { Enrollment } from '../enrollments/enrollment.entity.js'
import { Student } from '../students/student.entity.js'
import { InitSchema1731500000000 } from './migrations/1731500000000-init-schema.js'

// DATABASE_URL: "postgresql://..." usa Postgres; qualquer outro valor e o caminho do SQLite (ou ":memory:")
export const buildTypeOrmOptions = (): TypeOrmModuleOptions => {
  const url = process.env.DATABASE_URL ?? './dev.db'
  const base = {
    entities: [Course, Student, Enrollment],
    migrations: [InitSchema1731500000000],
    migrationsRun: true,
    synchronize: false,
  }
  if (url.startsWith('postgres')) return { ...base, type: 'postgres', url }
  return { ...base, type: 'better-sqlite3', database: url }
}

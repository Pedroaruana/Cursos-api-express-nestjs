import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller.js'
import { buildTypeOrmOptions } from './database/typeorm.config.js'
import { CoursesModule } from './courses/courses.module.js'
import { EnrollmentsModule } from './enrollments/enrollments.module.js'
import { StudentsModule } from './students/students.module.js'

@Module({
  imports: [
    // factory: le DATABASE_URL no bootstrap (e nao no import), o que permite trocar no teste
    TypeOrmModule.forRootAsync({ useFactory: buildTypeOrmOptions }),
    CoursesModule,
    StudentsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

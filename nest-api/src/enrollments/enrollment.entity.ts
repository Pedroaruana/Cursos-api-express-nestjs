import {
  CreateDateColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  type Relation,
} from 'typeorm'
import { Course } from '../courses/course.entity.js'
import { Student } from '../students/student.entity.js'

@Entity('enrollment')
@Unique('UQ_enrollment_student_course', ['studentId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentId: number

  @Column()
  courseId: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Relation<Student>

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Relation<Course>
}

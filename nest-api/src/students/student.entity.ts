import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('student')
@Unique('UQ_student_email', ['email'])
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @CreateDateColumn()
  createdAt: Date
}

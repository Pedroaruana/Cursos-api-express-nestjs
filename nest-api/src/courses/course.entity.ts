import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'varchar', nullable: true })
  category: string | null

  @Column({ type: 'varchar', nullable: true })
  description: string | null

  @CreateDateColumn()
  createdAt: Date
}

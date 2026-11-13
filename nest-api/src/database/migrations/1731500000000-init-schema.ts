import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

// Migration escrita com a API de Table para funcionar em SQLite e Postgres
export class InitSchema1731500000000 implements MigrationInterface {
  name = 'InitSchema1731500000000'

  async up(q: QueryRunner) {
    const pg = q.connection.options.type === 'postgres'
    const id = {
      name: 'id',
      type: 'integer',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment' as const,
    }
    const createdAt = {
      name: 'createdAt',
      type: pg ? 'timestamp' : 'datetime',
      default: pg ? 'now()' : "datetime('now')",
    }

    await q.createTable(
      new Table({
        name: 'course',
        columns: [
          id,
          { name: 'title', type: 'varchar' },
          { name: 'category', type: 'varchar', isNullable: true },
          { name: 'description', type: 'varchar', isNullable: true },
          createdAt,
        ],
      }),
    )

    await q.createTable(
      new Table({
        name: 'student',
        columns: [id, { name: 'name', type: 'varchar' }, { name: 'email', type: 'varchar' }, createdAt],
        uniques: [{ name: 'UQ_student_email', columnNames: ['email'] }],
      }),
    )

    await q.createTable(
      new Table({
        name: 'enrollment',
        columns: [id, { name: 'studentId', type: 'integer' }, { name: 'courseId', type: 'integer' }, createdAt],
        uniques: [{ name: 'UQ_enrollment_student_course', columnNames: ['studentId', 'courseId'] }],
        foreignKeys: [
          {
            columnNames: ['studentId'],
            referencedTableName: 'student',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['courseId'],
            referencedTableName: 'course',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    )
  }

  async down(q: QueryRunner) {
    await q.dropTable('enrollment')
    await q.dropTable('student')
    await q.dropTable('course')
  }
}

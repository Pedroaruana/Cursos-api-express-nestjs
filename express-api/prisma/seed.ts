import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const courses = [
    { title: 'Node.js do zero', category: 'backend', description: 'APIs REST com Node' },
    { title: 'React na pratica', category: 'frontend', description: 'Componentes e hooks' },
    { title: 'Banco de dados SQL', category: 'dados', description: 'Modelagem e consultas' },
  ]
  const students = [
    { name: 'Ana Souza', email: 'ana@example.com' },
    { name: 'Bruno Lima', email: 'bruno@example.com' },
  ]

  for (const data of courses) {
    const exists = await prisma.course.findFirst({ where: { title: data.title } })
    if (!exists) await prisma.course.create({ data })
  }
  for (const data of students) {
    await prisma.student.upsert({ where: { email: data.email }, update: {}, create: data })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

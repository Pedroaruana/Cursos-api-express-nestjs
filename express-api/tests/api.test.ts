import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/lib/prisma'

beforeEach(async () => {
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.student.deleteMany()
})

afterAll(() => prisma.$disconnect())

const newCourse = (title = 'Node.js do zero') => request(app).post('/api/courses').send({ title })
const newStudent = (email = 'ana@example.com') => request(app).post('/api/students').send({ name: 'Ana', email })

describe('GET /health', () => {
  it('retorna 200 e status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('POST /api/courses', () => {
  it('cria curso valido (201)', async () => {
    const res = await request(app).post('/api/courses').send({ title: 'Node.js', category: 'backend' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ title: 'Node.js', category: 'backend' })
    expect(res.body.id).toBeDefined()
  })

  it('rejeita title curto (422) com corpo de erro padronizado', async () => {
    const res = await request(app).post('/api/courses').send({ title: 'ab' })
    expect(res.status).toBe(422)
    expect(res.body).toMatchObject({ message: 'payload invalido', path: '/api/courses' })
    expect(res.body.details[0].field).toBe('title')
    expect(res.body.timestamp).toBeDefined()
  })

  it('rejeita JSON malformado (400)', async () => {
    const res = await request(app).post('/api/courses').set('Content-Type', 'application/json').send('{ x')
    expect(res.status).toBe(400)
  })
})

describe('GET /api/courses', () => {
  it('filtra por category e pagina', async () => {
    await request(app).post('/api/courses').send({ title: 'Curso A', category: 'x' })
    await request(app).post('/api/courses').send({ title: 'Curso B', category: 'x' })
    await request(app).post('/api/courses').send({ title: 'Curso C', category: 'y' })

    const byCat = await request(app).get('/api/courses?category=x')
    expect(byCat.body).toHaveLength(2)

    const page = await request(app).get('/api/courses?page=2&limit=2')
    expect(page.body).toHaveLength(1)
    expect(page.headers['x-total-count']).toBe('3')
  })
})

describe('GET /api/courses/:id', () => {
  it('inexistente retorna 404', async () => {
    const res = await request(app).get('/api/courses/999')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ message: 'Curso nao encontrado', path: '/api/courses/999' })
  })
})

describe('PUT/DELETE /api/courses/:id', () => {
  it('atualiza (200) e remove (204), depois 404', async () => {
    const { body } = await newCourse()
    const put = await request(app).put(`/api/courses/${body.id}`).send({ title: 'Novo titulo' })
    expect(put.status).toBe(200)
    expect(put.body.title).toBe('Novo titulo')

    expect((await request(app).delete(`/api/courses/${body.id}`)).status).toBe(204)
    expect((await request(app).delete(`/api/courses/${body.id}`)).status).toBe(404)
    expect((await request(app).put(`/api/courses/${body.id}`).send({ title: 'Qualquer' })).status).toBe(404)
  })
})

describe('Students', () => {
  it('cria (201), rejeita email invalido (422) e duplicado (409)', async () => {
    expect((await newStudent()).status).toBe(201)
    expect((await request(app).post('/api/students').send({ name: 'X', email: 'nao-e-email' })).status).toBe(422)
    const dup = await newStudent()
    expect(dup.status).toBe(409)
    expect(dup.body.message).toBe('email ja cadastrado')
  })

  it('PUT com email de outro estudante retorna 409', async () => {
    await newStudent('a@example.com')
    const b = await newStudent('b@example.com')
    const res = await request(app).put(`/api/students/${b.body.id}`).send({ name: 'B', email: 'a@example.com' })
    expect(res.status).toBe(409)
  })

  it('id inexistente retorna 404', async () => {
    expect((await request(app).get('/api/students/999')).status).toBe(404)
  })
})

describe('Enrollments', () => {
  it('matricula (201), repeticao retorna 409 e nao duplica', async () => {
    const s = await newStudent()
    const c = await newCourse()
    const payload = { studentId: s.body.id, courseId: c.body.id }

    expect((await request(app).post('/api/enrollments').send(payload)).status).toBe(201)
    expect((await request(app).post('/api/enrollments').send(payload)).status).toBe(409)

    const list = await request(app).get(`/api/students/${s.body.id}/enrollments`)
    expect(list.status).toBe(200)
    expect(list.body).toHaveLength(1)
    expect(list.body[0].course.title).toBe('Node.js do zero')
  })

  it('studentId ou courseId inexistente retorna 404', async () => {
    const s = await newStudent()
    const c = await newCourse()
    expect((await request(app).post('/api/enrollments').send({ studentId: 999, courseId: c.body.id })).status).toBe(404)
    expect((await request(app).post('/api/enrollments').send({ studentId: s.body.id, courseId: 999 })).status).toBe(404)
  })

  it('cancela matricula (204) e depois 404', async () => {
    const s = await newStudent()
    const c = await newCourse()
    const e = await request(app).post('/api/enrollments').send({ studentId: s.body.id, courseId: c.body.id })
    expect((await request(app).delete(`/api/enrollments/${e.body.id}`)).status).toBe(204)
    expect((await request(app).delete(`/api/enrollments/${e.body.id}`)).status).toBe(404)
  })
})

describe('rota inexistente', () => {
  it('retorna 404 padronizado', async () => {
    const res = await request(app).get('/api/nada')
    expect(res.status).toBe(404)
    expect(res.body.path).toBe('/api/nada')
  })
})

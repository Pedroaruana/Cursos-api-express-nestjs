import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module.js'
import { configureApp } from '../src/app.setup.js'

let app: INestApplication

// app novo por teste = banco em memoria novo, com as migrations aplicadas do zero
beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
  app = moduleRef.createNestApplication()
  configureApp(app)
  await app.init()
})

afterEach(() => app.close())

const http = () => request(app.getHttpServer())
const newCourse = (title = 'Node.js do zero') => http().post('/api/courses').send({ title })
const newStudent = (email = 'ana@example.com') => http().post('/api/students').send({ name: 'Ana', email })

describe('GET /health', () => {
  it('retorna 200 e status ok', async () => {
    const res = await http().get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('POST /api/courses', () => {
  it('cria curso valido (201)', async () => {
    const res = await http().post('/api/courses').send({ title: 'Node.js', category: 'backend' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ title: 'Node.js', category: 'backend' })
    expect(res.body.id).toBeDefined()
  })

  it('rejeita title curto (422) com corpo de erro padronizado', async () => {
    const res = await http().post('/api/courses').send({ title: 'ab' })
    expect(res.status).toBe(422)
    expect(res.body).toMatchObject({ message: 'payload invalido', path: '/api/courses' })
    expect(res.body.details[0]).toContain('title')
    expect(res.body.timestamp).toBeDefined()
  })

  it('rejeita campos desconhecidos (422)', async () => {
    const res = await http().post('/api/courses').send({ title: 'Node.js', extra: 1 })
    expect(res.status).toBe(422)
  })
})

describe('GET /api/courses', () => {
  it('filtra por category e pagina', async () => {
    await http().post('/api/courses').send({ title: 'Curso A', category: 'x' })
    await http().post('/api/courses').send({ title: 'Curso B', category: 'x' })
    await http().post('/api/courses').send({ title: 'Curso C', category: 'y' })

    const byCat = await http().get('/api/courses?category=x')
    expect(byCat.body).toHaveLength(2)

    const page = await http().get('/api/courses?page=2&limit=2')
    expect(page.body).toHaveLength(1)
    expect(page.headers['x-total-count']).toBe('3')
  })
})

describe('GET /api/courses/:id', () => {
  it('inexistente retorna 404', async () => {
    const res = await http().get('/api/courses/999')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ message: 'Curso nao encontrado', path: '/api/courses/999' })
  })

  it('id nao numerico retorna 422', async () => {
    expect((await http().get('/api/courses/abc')).status).toBe(422)
  })
})

describe('PUT/DELETE /api/courses/:id', () => {
  it('atualiza (200) e remove (204), depois 404', async () => {
    const { body } = await newCourse()
    const put = await http().put(`/api/courses/${body.id}`).send({ title: 'Novo titulo' })
    expect(put.status).toBe(200)
    expect(put.body.title).toBe('Novo titulo')

    expect((await http().delete(`/api/courses/${body.id}`)).status).toBe(204)
    expect((await http().delete(`/api/courses/${body.id}`)).status).toBe(404)
    expect((await http().put(`/api/courses/${body.id}`).send({ title: 'Qualquer' })).status).toBe(404)
  })
})

describe('Students', () => {
  it('cria (201), rejeita email invalido (422) e duplicado (409)', async () => {
    expect((await newStudent()).status).toBe(201)
    expect((await http().post('/api/students').send({ name: 'X', email: 'nao-e-email' })).status).toBe(422)
    const dup = await newStudent()
    expect(dup.status).toBe(409)
    expect(dup.body.message).toBe('email ja cadastrado')
  })

  it('PUT com email de outro estudante retorna 409', async () => {
    await newStudent('a@example.com')
    const b = await newStudent('b@example.com')
    const res = await http().put(`/api/students/${b.body.id}`).send({ name: 'B', email: 'a@example.com' })
    expect(res.status).toBe(409)
  })

  it('id inexistente retorna 404', async () => {
    expect((await http().get('/api/students/999')).status).toBe(404)
  })
})

describe('Enrollments', () => {
  it('matricula (201), repeticao retorna 409 e nao duplica', async () => {
    const s = await newStudent()
    const c = await newCourse()
    const payload = { studentId: s.body.id, courseId: c.body.id }

    expect((await http().post('/api/enrollments').send(payload)).status).toBe(201)
    expect((await http().post('/api/enrollments').send(payload)).status).toBe(409)

    const list = await http().get(`/api/students/${s.body.id}/enrollments`)
    expect(list.status).toBe(200)
    expect(list.body).toHaveLength(1)
    expect(list.body[0].course.title).toBe('Node.js do zero')
  })

  it('studentId ou courseId inexistente retorna 404', async () => {
    const s = await newStudent()
    const c = await newCourse()
    expect((await http().post('/api/enrollments').send({ studentId: 999, courseId: c.body.id })).status).toBe(404)
    expect((await http().post('/api/enrollments').send({ studentId: s.body.id, courseId: 999 })).status).toBe(404)
  })

  it('cancela matricula (204) e depois 404', async () => {
    const s = await newStudent()
    const c = await newCourse()
    const e = await http().post('/api/enrollments').send({ studentId: s.body.id, courseId: c.body.id })
    expect((await http().delete(`/api/enrollments/${e.body.id}`)).status).toBe(204)
    expect((await http().delete(`/api/enrollments/${e.body.id}`)).status).toBe(404)
  })

  it('remover estudante apaga as matriculas (cascade)', async () => {
    const s = await newStudent()
    const c = await newCourse()
    await http().post('/api/enrollments').send({ studentId: s.body.id, courseId: c.body.id })
    expect((await http().delete(`/api/students/${s.body.id}`)).status).toBe(204)
    expect((await http().get(`/api/students/${s.body.id}/enrollments`)).status).toBe(404)
  })
})

describe('rota inexistente', () => {
  it('retorna 404 padronizado', async () => {
    const res = await http().get('/api/nada')
    expect(res.status).toBe(404)
    expect(res.body.path).toBe('/api/nada')
  })
})

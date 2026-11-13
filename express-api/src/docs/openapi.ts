const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` })
const json = (schema: object) => ({ 'application/json': { schema } })
const err = (description: string) => ({ description, content: json(ref('Error')) })
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
const pageParams = [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
]
const crud = (tag: string, schema: string, bodySchema: string, extraList: object[] = []) => ({
  collection: {
    post: {
      tags: [tag],
      summary: `Cria ${tag}`,
      requestBody: { required: true, content: json(ref(bodySchema)) },
      responses: {
        201: { description: 'Criado', content: json(ref(schema)) },
        409: err('Conflito'),
        422: err('Payload invalido'),
      },
    },
    get: {
      tags: [tag],
      summary: `Lista ${tag}`,
      parameters: [...extraList, ...pageParams],
      responses: {
        200: { description: 'Lista (total no header X-Total-Count)', content: json({ type: 'array', items: ref(schema) }) },
        422: err('Query invalida'),
      },
    },
  },
  item: {
    get: {
      tags: [tag],
      summary: `Busca ${tag} por id`,
      parameters: [idParam],
      responses: { 200: { description: 'OK', content: json(ref(schema)) }, 404: err('Nao encontrado') },
    },
    put: {
      tags: [tag],
      summary: `Atualiza ${tag}`,
      parameters: [idParam],
      requestBody: { required: true, content: json(ref(bodySchema)) },
      responses: {
        200: { description: 'Atualizado', content: json(ref(schema)) },
        404: err('Nao encontrado'),
        409: err('Conflito'),
        422: err('Payload invalido'),
      },
    },
    delete: {
      tags: [tag],
      summary: `Remove ${tag}`,
      parameters: [idParam],
      responses: { 204: { description: 'Removido' }, 404: err('Nao encontrado') },
    },
  },
})

const courses = crud('Courses', 'Course', 'CourseInput', [{ name: 'category', in: 'query', schema: { type: 'string' } }])
const students = crud('Students', 'Student', 'StudentInput')

export const openapi = {
  openapi: '3.0.3',
  info: { title: 'API de Catalogo de Cursos', version: '1.0.0' },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { 200: { description: 'OK', content: json({ type: 'object', properties: { status: { type: 'string', example: 'ok' } } }) } },
      },
    },
    '/api/courses': courses.collection,
    '/api/courses/{id}': courses.item,
    '/api/students': students.collection,
    '/api/students/{id}': students.item,
    '/api/students/{id}/enrollments': {
      get: {
        tags: ['Enrollments'],
        summary: 'Lista matriculas do estudante (com o curso)',
        parameters: [idParam],
        responses: { 200: { description: 'OK', content: json({ type: 'array', items: ref('EnrollmentWithCourse') }) }, 404: err('Estudante nao encontrado') },
      },
    },
    '/api/enrollments': {
      post: {
        tags: ['Enrollments'],
        summary: 'Matricula um estudante em um curso',
        requestBody: { required: true, content: json(ref('EnrollmentInput')) },
        responses: {
          201: { description: 'Criada', content: json(ref('Enrollment')) },
          404: err('Estudante ou curso inexistente'),
          409: err('Matricula duplicada'),
          422: err('Payload invalido'),
        },
      },
    },
    '/api/enrollments/{id}': {
      delete: {
        tags: ['Enrollments'],
        summary: 'Cancela matricula',
        parameters: [idParam],
        responses: { 204: { description: 'Removida' }, 404: err('Nao encontrada') },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Curso nao encontrado' },
          details: { type: 'array', items: { type: 'object' } },
          path: { type: 'string', example: '/api/courses/999' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      CourseInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 3, example: 'Node.js do zero' },
          category: { type: 'string', example: 'backend' },
          description: { type: 'string' },
        },
      },
      Course: {
        allOf: [ref('CourseInput'), { type: 'object', properties: { id: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' } } }],
      },
      StudentInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: { name: { type: 'string', example: 'Ana Souza' }, email: { type: 'string', format: 'email', example: 'ana@example.com' } },
      },
      Student: {
        allOf: [ref('StudentInput'), { type: 'object', properties: { id: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' } } }],
      },
      EnrollmentInput: {
        type: 'object',
        required: ['studentId', 'courseId'],
        properties: { studentId: { type: 'integer' }, courseId: { type: 'integer' } },
      },
      Enrollment: {
        allOf: [ref('EnrollmentInput'), { type: 'object', properties: { id: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' } } }],
      },
      EnrollmentWithCourse: {
        allOf: [ref('Enrollment'), { type: 'object', properties: { course: ref('Course') } }],
      },
    },
  },
}

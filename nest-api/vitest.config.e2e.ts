import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // banco isolado: SQLite em memoria (as migrations rodam no bootstrap do app)
    env: { DATABASE_URL: ':memory:' },
  },
})

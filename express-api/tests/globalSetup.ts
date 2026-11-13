import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { join } from 'node:path'

export default () => {
  const root = join(__dirname, '..')
  for (const f of ['test.db', 'test.db-journal']) rmSync(join(root, 'prisma', f), { force: true })
  // aplica as migrations do zero no banco de teste
  execSync('npx prisma migrate deploy', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  })
}

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testRegex: '[.]test[.]ts$',
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  setupFiles: ['<rootDir>/tests/env.ts'],
  maxWorkers: 1,
}

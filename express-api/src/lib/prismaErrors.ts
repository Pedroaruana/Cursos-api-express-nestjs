import { Prisma } from '@prisma/client'

export const isPrismaError = (e: unknown, code: string): e is Prisma.PrismaClientKnownRequestError =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === code

// P2002 = unique, P2025 = registro nao encontrado, P2003 = FK invalida
export const PRISMA_UNIQUE = 'P2002'
export const PRISMA_NOT_FOUND = 'P2025'
export const PRISMA_FK = 'P2003'

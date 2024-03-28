import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
 const prisma: undefined | ReturnType<typeof prismaClientSingleton>
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const db = globalForPrisma.prisma ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
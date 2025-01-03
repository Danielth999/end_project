import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = global.prisma
 
export const prisma = globalForPrisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") global.prisma = prisma

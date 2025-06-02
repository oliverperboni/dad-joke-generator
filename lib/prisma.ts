// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, evite criar múltiplas instâncias do PrismaClient
  // devido ao hot reloading do Next.js.
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
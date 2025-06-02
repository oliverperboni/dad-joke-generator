// lib/prisma.ts (Exemplo mais robusto para Next.js/Serverless)
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Exporta uma instância da função, em vez de uma instância global direta
export default getPrismaClient();

// Ou, se quiseres ser mais explícito em como gerir a vida útil da conexão:

// lib/prisma.ts (Opção 2: Desconectar e reconectar explicitamente, menos comum para Next.js por padrão)
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default prisma;

// E depois na tua API route:
// try {
//   // ... teu código ...
// } finally {
//   // Desconecta o Prisma APÓS cada requisição para garantir uma nova sessão
//   await prisma.$disconnect();
// }
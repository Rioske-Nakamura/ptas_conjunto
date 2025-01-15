// Importando o Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchAllData() {
  try {
    // Buscando todos os usuários e todas as tabelas
    const data = await prisma.table.findMany({
      include: {
        user: true, // Inclui o usuário associado à tabela
      },
    });

    console.log(data); // Exibe os dados das tabelas e os usuários associados
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client
  }
}

fetchAllData();

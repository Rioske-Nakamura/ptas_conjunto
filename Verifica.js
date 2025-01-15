// Importando o Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchAllData() {
  try {
    // Buscando todos os usuários, incluindo as tabelas relacionadas
    const users = await prisma.user.findMany({
      include: {
        tables: true, // Inclui as tabelas relacionadas
      },
    });

    console.log(users); // Exibe os dados dos usuários e suas tabelas
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client
  }
}

fetchAllData();

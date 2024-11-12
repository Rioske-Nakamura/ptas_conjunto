const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()


console.log('Conectado ao Prisma!')

module.exports = prisma
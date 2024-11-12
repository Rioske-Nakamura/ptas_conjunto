const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {  
    const user = await prisma.user.create({
        data: {
            nome: 'Marya',
            email: 'marya@example.com',
            password: '123456',
            tipo: 'Ajudante'
        }
    })
    console.log("User created: " + JSON.stringify(user))

    const users = await prisma.user.findMany()
    console.log("Users: " )
    console.log(users)
}

main()
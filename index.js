const prisma = require('./prisma/prismaClient')


const express= require('express')
const app = express()
app.use(express.json())

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)


const AuthController = require('./controllers/AuthControllers');
const tableRoutes = require('./routes/tableRoutes')   
app.use('/table', tableRoutes)


const admRoutes = require('./routes/admRoutes');
app.use('/admin',  admRoutes);

app.listen(8000)

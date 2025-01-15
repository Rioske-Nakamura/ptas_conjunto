const bcryptjs = require('bcryptjs');
const prisma = require('../prisma/prismaClient')
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        const { nome, email, password } = req.body;

        if (!nome || nome.length < 6) {
            return res.status(422).json({
                erro: true,
                msg: "O nome deve ter no mínimo 6 caracteres"
            });
        }

        if (!email || email.length < 10 || (!email.endsWith("@gmail.com") && 
            !email.endsWith("@hotmail.com") && !email.endsWith("@example.com"))) {
            return res.status(422).json({
                erro: true,
                msg: "Email inválido"
            });
        }

        if (!password || password.length < 6 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(422).json({
                erro: true,
                msg: "A senha deve ter no mínimo 6 caracteres e conter números e letras"
            });
        }

        const existe = await prisma.user.count({
            where: { email }
        });

        if (existe != 0) {
            return res.status(422).json({
                erro: true,
                msg: "Email já cadastrado"
            });
        }

        const salt = await bcryptjs.genSalt(8);
        const hashPass = await bcryptjs.hash(password, salt);

        try {
            const usuario = await prisma.user.create({
                data: {
                    nome,
                    email,
                    password: hashPass,
                    tipo: "Cliente"
                }///ADM
            });
            const token = jwt.sign(
                { id: usuario.id },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            return res.status(201).json({
                erro: false,
                msg: "Usuário cadastrado com sucesso",
                token
            });
        } catch (error) {
            return res.status(500).json({
                erro: true,
                msg: "Erro ao cadastrar o usuário, tente novamente",
                error: error.message || error
            });
            
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        const usuario = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            return res.status(422).json({
                erro: true,
                msg: "Email ou senha incorretos!"
            });
        }

        const senhaCorreta = bcryptjs.compareSync(password, usuario.password);
        if (!senhaCorreta) {
            return res.status(422).json({
                erro: true,
                msg: "Email ou senha incorretos!"
            });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            erro: false,
            msg: "Login efetuado com sucesso",
            token
        });
    }

    static async VerificaAutenticacao(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
    
            if (!token) {
                return res.status(401).json({
                    erro: true,
                    msg: "Token não encontrado"
                });
            }
    
            jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
                if (err) {
                    return res.status(403).json({
                        erro: true,
                        msg: "Token inválido"
                    });
                }
                req.usuarioID = payload.id;
                next();
            });
        } catch (error) {
            return res.status(500).json({
                erro: true,
                msg: "Erro interno no servidor"
            });
        }
    }
    

    static async VerificaADM(req, res, next) {
        const usuario = await prisma.user.findUnique({
            where: { id: req.usuarioID }
        });

        if (usuario.tipo == "ADM") {
           
            next()
        }else{
            return res.status(403).json({
                erro: true,
                msg: "Você não tem permissão para acessar esse recurso"
            });
        }


    }
}

module.exports = AuthController;

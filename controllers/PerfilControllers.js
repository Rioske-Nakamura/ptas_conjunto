const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcryptjs');

class PerfilController {

  
  static async updateProfile(req, res) {
    const { nome, email, password } = req.body;
    const { userId } = req.params;

    try {

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({
          erro: true,
          msg: "Usuário não encontrado.",
        });
      }

    
      let updatedPassword = user.password;
      if (password) {
        updatedPassword = await bcrypt.hash(password, 10); 
      }


      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          nome: nome || user.nome,
          email: email || user.email,
          password: updatedPassword,
        },
      });

      return res.status(200).json({
        erro: false,
        msg: "Perfil atualizado com sucesso.",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        msg: "Erro ao atualizar perfil.",
        error,
      });
    }
  }
}

module.exports = PerfilController;

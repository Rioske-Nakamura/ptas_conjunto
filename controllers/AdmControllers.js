const prisma = require('../prisma/prismaClient');

class AdminController {

  static async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await prisma.user.delete({
        where: { id: parseInt(userId) },
      });

      return res.status(200).json({
        erro: false,
        msg: "Usuário excluído com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        msg: "Erro ao excluir o usuário.",
        error,
      });
    }
  }
  static async getAllTables(req, res) {
    try {
      const tables = await prisma.table.findMany(); // Busca todas as mesas
      return res.status(200).json({
        erro: false,
        tables,
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        msg: "Erro ao buscar mesas.",
        error,
      });
    }
  }
  // Excluir mesa
  static async deleteTable(req, res) {
    const { tableName } = req.params; // Nome da mesa a ser excluída

    try {
      const table = await prisma.table.delete({
        where: { name: tableName },
      });

      return res.status(200).json({
        erro: false,
        msg: "Mesa excluída com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        msg: "Erro ao excluir a mesa.",
        error,
      });
    }
  }

// Adicionar mesa
static async addTable(req, res) {
  const { name, columns, rows } = req.body;

  // Validar os campos obrigatórios
  if (!name || typeof columns !== "number" || typeof rows !== "number") {
    return res.status(400).json({
      erro: true,
      msg: "Os campos name, columns e rows são obrigatórios e devem ser válidos.",
    });
  }

  try {
    const newTable = await prisma.table.create({
      data: { name, columns, rows },
    });

    return res.status(201).json({
      erro: false,
      msg: "Mesa adicionada com sucesso.",
      table: newTable,
    });
  } catch (error) {
    return res.status(500).json({
      erro: true,
      msg: "Erro ao adicionar a mesa.",
      error,
    });
  }
}


  // Cancelar reserva da mesa
  static async cancelReservation(req, res) {
    const { tableId, userId } = req.body; // ID da mesa e ID do usuário

    try {
      const table = await prisma.table.findUnique({
        where: { id: tableId },
      });

      if (!table || table.userId !== userId) {
        return res.status(403).json({
          erro: true,
          msg: "A mesa não está reservada ou não pertence ao usuário.",
        });
      }

      // Cancelar a reserva (remover o userId da mesa)
      await prisma.table.update({
        where: { id: tableId },
        data: { userId: null },
      });

      return res.status(200).json({
        erro: false,
        msg: "Reserva cancelada com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        msg: "Erro ao cancelar a reserva.",
        error,
      });
    }
  }
}

module.exports = AdminController;

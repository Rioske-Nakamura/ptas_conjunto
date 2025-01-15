const prisma = require('../prisma/prismaClient');
const bcryptjs = require('bcryptjs');

class TableController {
    // Exibir reservas do usuário e permitir cancelar com senha
    static async Reservas(req, res) {
        const { userId, password, tableId } = req.body;

        try {
            // Buscar reservas do usuário
            const reservas = await prisma.table.findMany({ where: { userId } });
            if (!reservas.length) {
                return res.status(404).json({ erro: true, msg: "Nenhuma reserva encontrada para este usuário." });
            }

            // Cancelar reserva se `tableId` e `password` forem fornecidos
            if (tableId && password) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (!user || !bcryptjs.compareSync(password, user.password)) {
                    return res.status(403).json({ erro: true, msg: "Senha incorreta ou usuário não encontrado." });
                }

                const reserva = await prisma.table.findUnique({ where: { id: tableId } });
                if (!reserva || reserva.userId !== userId) {
                    return res.status(403).json({ erro: true, msg: "Reserva não encontrada ou não pertence ao usuário." });
                }

                await prisma.table.update({ where: { id: tableId }, data: { userId: null } });
                return res.status(200).json({ erro: false, msg: "Reserva cancelada com sucesso." });
            }

            return res.status(200).json({ erro: false, reservas });
        } catch (error) {
            return res.status(500).json({ erro: true, msg: "Erro ao buscar reservas.", error });
        }
    }

    // Criar grade de mesas 10x10
    static async createTableGrid(req, res) {
        try {
            const tables = [];
            for (let row = 1; row <= 10; row++) {
                for (let col = 1; col <= 10; col++) {
                    tables.push({ name: `Mesa ${row}-${col}`, rows: row, columns: col });
                }
            }
            await prisma.table.createMany({ data: tables });
            return res.status(201).json({ erro: false, msg: "Grade 10x10 criada com sucesso." });
        } catch (error) {
            return res.status(500).json({ erro: true, msg: "Erro ao criar grade de mesas.", error });
        }
    }

    // Buscar grade de mesas
    static async fetchTableGrid(req, res) {
        try {
            const tables = await prisma.table.findMany({ include: { user: true } });
            const grid = Array.from({ length: 10 }, (_, row) =>
                Array.from({ length: 10 }, (_, col) => {
                    const table = tables.find((t) => t.rows === row + 1 && t.columns === col + 1);
                    return table
                        ? { id: table.id, name: table.name, reserved: !!table.userId, nickname: table.nickname || "" }
                        : null;
                })
            );
            return res.status(200).json({ erro: false, grid });
        } catch (error) {
            return res.status(500).json({ erro: true, msg: "Erro ao buscar grade de mesas.", error });
        }
    }


   // Reservar mesa
   static async reserveTable(req, res) {
    const { tableId, nickname, contact, userId } = req.body;

    if (!nickname || !contact) {
        return res.status(400).json({
            erro: true,
            msg: "Os campos 'nickname' e 'contact' são obrigatórios."
        });
    }

    try {
        const table = await prisma.table.findUnique({ where: { id: tableId } });

        if (!table) {
            return res.status(404).json({ erro: true, msg: "Mesa não encontrada." });
        }

        if (table.userId) {
            return res.status(400).json({ erro: true, msg: "Mesa já reservada." });
        }

        console.log(`Reservando mesa: ${tableId}, para usuário: ${userId}`);

        await prisma.table.update({
            where: { id: tableId },
            data: { userId, nickname, contact },
        });

        return res.status(200).json({ erro: false, msg: "Mesa reservada com sucesso." });
    } catch (error) {
        console.error("Erro ao reservar mesa:", error);
        return res.status(500).json({ erro: true, msg: "Erro ao reservar mesa.", error });
    }
}

// Atualizar reservas do usuário
static async listUserReservations(req, res) {
    const { userId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            include: { tables: true }, // Inclua as reservas associadas ao usuário
        });

        if (!user || !user.tables.length) {
            return res.status(404).json({ erro: true, msg: "Nenhuma reserva encontrada." });
        }

        return res.status(200).json({ erro: false, reservas: user.tables });
    } catch (error) {
        return res.status(500).json({ erro: true, msg: "Erro ao buscar reservas.", error });
    }
}



// Cancelar reserva
static async cancelReservation(req, res) {
    const { userId, tableId } = req.body;

    try {
        const table = await prisma.table.findUnique({ where: { id: tableId } });

        if (!table || table.userId !== userId) {
            return res.status(404).json({
                erro: true,
                msg: "Reserva não encontrada ou usuário não autorizado.",
            });
        }

        await prisma.table.update({
            where: { id: tableId },
            data: { userId: null, nickname: null, contact: null },
        });

        return res.status(200).json({ erro: false, msg: "Reserva cancelada com sucesso." });
    } catch (error) {
        return res.status(500).json({ erro: true, msg: "Erro ao cancelar reserva.", error });
    }
}


}

module.exports = TableController;

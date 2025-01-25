const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdmControllers');

// Excluir usuário
router.delete('/delete-user/:userId', AdminController.deleteUser);

// Excluir mesa
router.delete('/delete-table/:tableName', AdminController.deleteTable);

// Adicionar mesa
router.post('/add-table', AdminController.addTable);

// Cancelar reserva
router.post('/cancel-reservation', AdminController.cancelReservation);

router.get("/tables", AdminController.getAllTables);

module.exports = router;

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdmControllers');

// Excluir usuário
router.delete('/user/:userId', AdminController.deleteUser);

// Excluir mesa
router.delete('/table/:tableName', AdminController.deleteTable);

// Adicionar mesa
router.post('/table', AdminController.addTable);

// Cancelar reserva
router.post('/cancel-reservation', AdminController.cancelReservation);

module.exports = router;

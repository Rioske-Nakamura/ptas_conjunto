const express= require('express');
const router = express.Router();

const TableController = require('../controllers/TableControllers')

router.get('/reservas', TableController.Reservas)


router.get('/grid', TableController.fetchTableGrid); // Busca a grade de mesas
router.post('/grid', TableController.createTableGrid); // Cria a grade de mesas
router.post('/reserve', TableController.reserveTable); // Reserva uma mesa
router.get('/reservas/:userId', TableController.listUserReservations); // Listar reservas
router.post('/reservas/cancelar', TableController.cancelReservation); // Cancelar reserva


module.exports = router
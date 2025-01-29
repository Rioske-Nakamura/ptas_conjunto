const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/PerfilControllers');


router.put('/update-profile/:userId', PerfilController.updateProfile);

module.exports = router;

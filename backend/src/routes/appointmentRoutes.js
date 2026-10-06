const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const { validateAppointmentCreation } = require('../helpers/validators');
const verifyToken = require('../helpers/verify-token');

// Todas as rotas abaixo passam a exigir o token JWT
router.use(verifyToken);

// READ ALL 
router.get('/', AppointmentController.getAll);
// READ BY ID
router.get('/:id', AppointmentController.getById);
// EXPORT EXCEL
router.get('/exportar/excel', AppointmentController.exportExcelReport);
// CREATE
router.post('/', validateAppointmentCreation, AppointmentController.create);
// UPDATE COMPLETO
router.put('/:id', AppointmentController.update);
// UPDATE PARCIAL
router.patch('/:id/estado', AppointmentController.updateEstado);
// DELETE
router.delete('/:id', AppointmentController.delete);

module.exports = router;
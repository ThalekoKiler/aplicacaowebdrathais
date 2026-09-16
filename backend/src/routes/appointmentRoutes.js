const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const { validateAppointmentCreation } = require('../helpers/validators');

// READ ALL
router.get('/', AppointmentController.getAll);
// READ BY ID
router.get('/:id', AppointmentController.getById);
// CREATE
router.post('/', validateAppointmentCreation, AppointmentController.create);
// UPDATE COMPLETO (reagendamento, edição)
router.put('/:id', AppointmentController.update);
// UPDATE PARCIAL (alterar status rápido)
router.patch('/:id/estado', AppointmentController.updateEstado);
// DELETE
router.delete('/:id', AppointmentController.delete);

module.exports = router;
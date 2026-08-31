const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const { validateAppointmentCreation } = require('../helpers/validators');

router.get('/', AppointmentController.getAll);
router.get('/:id', AppointmentController.getById);
router.post('/', validateAppointmentCreation, AppointmentController.create);
router.patch('/:id/estado', AppointmentController.updateEstado);

module.exports = router;
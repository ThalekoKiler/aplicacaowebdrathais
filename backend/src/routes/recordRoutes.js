const express = require('express');
const router = express.Router();
const RecordController = require('../controllers/recordController');

// READ ALL
router.get('/', RecordController.getAll);
// READ BY PACIENTE ID
router.get('/paciente/:pacienteId', RecordController.getByPatientId);
// CREATE
router.post('/', RecordController.create);
// UPDATE
router.put('/paciente/:pacienteId', RecordController.update);
// DELETE
router.delete('/paciente:pacienteId', RecordController.delete);

module.exports = router;
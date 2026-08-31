const express = require('express');
const router = express.Router();
const RecordController = require('../controllers/recordController');

router.get('/paciente/:pacienteId', RecordController.getByPatientId);
router.post('/', RecordController.create);
router.put('/paciente:pacienteId', RecordController.update);

module.exports = router;
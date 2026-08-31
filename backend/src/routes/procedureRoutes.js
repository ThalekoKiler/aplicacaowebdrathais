const express = require('express');
const router = express.Router();
const ProcedureController = require('../controllers/procedureController');

router.get('/', ProcedureController.getAll);
router.post('/', ProcedureController.create);

module.exports = router;
const express = require('express');
const router = express.Router();
const ProcedureController = require('../controllers/procedureController');
const { validateProcedureCreation } = require('../helpers/validators');

// READ ALL
router.get('/', ProcedureController.getAll);
// READ BY ID
router.get('/:id', ProcedureController.getById);
// CREATE
router.post('/', validateProcedureCreation, ProcedureController.create);
// UPDATE
router.put('/:id', ProcedureController.update);
// DELETE
router.delete('/:id', ProcedureController.delete);

module.exports = router;
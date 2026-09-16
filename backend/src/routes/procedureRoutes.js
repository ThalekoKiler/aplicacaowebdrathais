const express = require('express');
const router = express.Router();
const ProcedureController = require('../controllers/procedureController');

// READ ALL
router.get('/', ProcedureController.getAll);
// READ BY ID
router.get('/:id', ProcedureController.getById);
// CREATE
router.post('/', ProcedureController.create);
// UPDATE
router.put('/:id', ProcedureController.update);
// DELETE
router.delete('/:id', ProcedureController.delete);

module.exports = router;
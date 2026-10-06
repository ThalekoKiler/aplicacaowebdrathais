const express = require('express');
const router = express.Router();
const ProcedureController = require('../controllers/procedureController');
const { validateProcedureCreation } = require('../helpers/validators');
const verifyToken = require('../helpers/verify-token');

// ROTAS PÚBLICAS 
router.get('/', ProcedureController.getAll);
router.get('/:id', ProcedureController.getById);

// ROTAS PROTEGIDAS
router.post('/', verifyToken, validateProcedureCreation, ProcedureController.create);
router.put('/:id', verifyToken, ProcedureController.update);
router.delete('/:id', verifyToken, ProcedureController.delete);

module.exports = router;
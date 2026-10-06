const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserCreation } = require('../helpers/validators');
const verifyToken = require('../helpers/verify-token');

// ROTAS PÚBLICAS
router.get('/cep/:cep', UserController.getAddressByCep);
router.post('/', validateUserCreation, UserController.create);
router.post('/login', UserController.login);

// ROTAS PROTEGIDAS (exigir token JWT)
router.get('/', verifyToken, UserController.getAll);
router.get('/:id', verifyToken, UserController.getById);
router.put('/:id', verifyToken, UserController.update);
router.delete('/:id', verifyToken, UserController.delete);

module.exports = router;
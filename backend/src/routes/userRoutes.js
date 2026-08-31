const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserCreation } = require('../helpers/validators');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', validateUserCreation, UserController.create);

module.exports = router;
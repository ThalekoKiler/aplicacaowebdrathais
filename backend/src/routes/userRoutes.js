const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserCreation } = require('../helpers/validators');

// READ ALL
router.get('/', UserController.getAll);
// READ BY ID
router.get('/:id', UserController.getById);
// CREATE
router.post('/', validateUserCreation, UserController.create);
// UPDATE
router.put('/:id', UserController.update);
// DELETE
router.delete('/:id', UserController.delete);

module.exports = router;
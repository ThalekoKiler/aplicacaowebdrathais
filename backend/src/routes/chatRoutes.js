const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const verifyToken = require('../helpers/verify-token');

// Rota protegida por autenticação JWT 
router.post('/mensagem', verifyToken, ChatController.sendMessage);

module.exports = router;
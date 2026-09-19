require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authHelper = {
    // Gerando Hash
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    // Comparando a senha c o Hash salvo no banco
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    },

    // Gerando o Token JWT com os dados essenciais do usuario
    createToken(user) {
        return jwt.sign(
            {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            },
            process.env.CHAVETOKEN,
            { expiresIn: '7d' } // VÁLIDO POR 7 DIAS
        );
    }
};

module.exports = authHelper;
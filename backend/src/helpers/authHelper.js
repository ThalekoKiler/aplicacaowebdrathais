const bcrypt = require('bcrypt');

const authHelper = {
    // Gerando Hash
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    // Comparando a senha c o Hash salvo no banco
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
};

module.exports = authHelper;
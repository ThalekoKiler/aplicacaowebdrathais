const jwt = require('jsonwebtoken');
require('dotenv').config();

// Emitir TOKEN JWT com ID, nome e tipo no payload assinado
const createUserToken = async (user, req, res) => {
    const token = jwt.sign(
        {
            id: user.id,
            name: user.nome,
            tipo: user.tipo // Mantem o nível de acesso (paciente / clínica) para os controllers
        },
        process.env.CHAVETOKEN,
        { expiresIn: '8h' } // Por medidas de segurança o TOKEN terá um tempo limite
    );

    return res.status(200).json({
        message: 'Autenticado com sucesso!',
        token: token,
        userId: user.id,
        tipo: user.tipo
    });
};

module.exports = createUserToken;
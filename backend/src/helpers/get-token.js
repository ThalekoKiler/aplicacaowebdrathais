const getToken = (req) => {
    // Extrair apenas o hash do token do Header HTTP
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    // O header vem no formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    return token;
};

module.exports = getToken;
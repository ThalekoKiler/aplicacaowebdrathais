const app = require('./app');
const pool = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Testar Conexão MYSQL
        const connection = await pool.getConnection();
        console.log('Conexão com o MYSQL realizada com sucesso!');
        connection.release();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar com MYSQL:', error.message);
        process.exit(1);
    }
}

startServer();
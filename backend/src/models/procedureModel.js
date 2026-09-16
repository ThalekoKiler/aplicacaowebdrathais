const pool = require('../config/database');

const ProcedureModel = {
    async findAll() {
        const [rows] = await pool.query(
            'SELECT id, nome, descricao, duracao_minutos, FROM procedimento'
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nome, descricao, duracao_minutos FROM procedimento WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create({ nome, descricao, duracao_minutos }) {
        const query = `
            INSERT INTO procedimento (nome, descricao, duracao_minutos)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            nome,
            descricao || null,
            duracao_minutos || 30
        ]);
        return result.insertId;
    }
};

module.exports = ProcedureModel;
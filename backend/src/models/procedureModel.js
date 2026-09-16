const pool = require('../config/database');

const ProcedureModel = {
    // READ (Todos)
    async findAll() {
        const [rows] = await pool.query(
            'SELECT id, nome, descricao, duracao_minutos FROM procedimento'
        );
        return rows;
    },

    // READ (por ID)
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nome, descricao, duracao_minutos FROM procedimento WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // CREATE 
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
    },

    // UPDATE
    async update(id, { nome, descricao, duracao_minutos }) {
        const query = `
            UPDATE procedimento
            SET nome = ?, descricao = ?, duracao_minutos = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [
            nome,
            descricao || null,
            duracao_minutos || 30,
            id
        ]);
        return result.affectedRows > 0;
    },

    // DELETE
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM procedimento WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = ProcedureModel;
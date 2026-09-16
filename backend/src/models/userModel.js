const pool = require('../config/database');
const { hashPassword } = require('../helpers/authHelper');

const UserModel = {
    // Buscando os usuarios
    async findAll() {
        const [rows] = await pool.query(
            'SELECT id, nome, email, telefone, tipo, criado_em FROM usuarios'
        );
        return rows;
    },

    // Buscando usuarios por ID
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nome, email, telefone, tipo, criado_em FROM usuarios WHERE id = ?', [id]
        );
        return rows[0];
    },

    // Buscar usuario por EMAIL
    async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?', [email]
        );
        return rows[0];
    },

    // CREATE
    async create({ nome, email, senha, telefone, tipo }) {
        const hashedPassword = await hashPassword(senha);

        const query = `
            INSERT INTO usuarios (nome, email, senha, telefone, tipo)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            nome,
            email,
            hashedPassword,
            telefone,
            tipo || 'PACIENTE'
        ]);
        return result.insertId;
    },

    // UPDATE
    async update(id, { nome, email, senha, telefone, tipo }) {
        if (senha) {
            const hashedPassword = await hashPassword(senha);
            const query = `
                UPDATE usuarios
                SET nome = ?, email = ?, senha = ?, telefone = ?, tipo = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                nome,
                email,
                hashedPassword,
                telefone,
                tipo || 'PACIENTE',
                id
            ]);
            return result.affectedRows > 0;
        }

        const query = `
            UPDATE usuarios
            SET nome = ?, email = ?, telefone = ?, tipo = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [
            nome,
            email,
            telefone,
            tipo || 'PACIENTE',
            id
        ]);
        return result.affectedRows > 0;
    },

    // DELETE
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;
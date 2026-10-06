const pool = require('../config/database');
const { hashPassword } = require('../helpers/authHelper');

const UserModel = {
    // Buscando os usuarios
    async findAll() {
        const query = `
            SELECT id, nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo, criado_em 
            FROM usuarios
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Buscando usuarios por ID
    async findById(id) {
        const query = `
            SELECT id, nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo, criado_em 
            FROM usuarios 
            WHERE id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    },

    // Buscar usuario por EMAIL (usado no Login e verificação de duplicidade)
    async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    // CREATE (Gera o hash da senha aqui dentro)
    async create({ nome, email, senha, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo }) {
        const hashedPassword = await hashPassword(senha);

        const query = `
            INSERT INTO usuarios 
                (nome, email, senha, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            nome,
            email,
            hashedPassword,
            telefone,
            cep || null,
            logradouro || null,
            numero || null,
            complemento || null,
            bairro || null,
            cidade || null,
            uf || null,
            tipo || 'PACIENTE'
        ]);
        return result.insertId;
    },

    // UPDATE (Gera o hash da nova senha se ela for informada)
    async update(id, { nome, email, senha, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo }) {
        if (senha) {
            const hashedPassword = await hashPassword(senha);
            const query = `
                UPDATE usuarios
                SET nome = ?, email = ?, senha = ?, telefone = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?, tipo = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                nome,
                email,
                hashedPassword,
                telefone,
                cep || null,
                logradouro || null,
                numero || null,
                complemento || null,
                bairro || null,
                cidade || null,
                uf || null,
                tipo || 'PACIENTE',
                id
            ]);
            return result.affectedRows > 0;
        }

        const query = `
            UPDATE usuarios
            SET nome = ?, email = ?, telefone = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?, tipo = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [
            nome,
            email,
            telefone,
            cep || null,
            logradouro || null,
            numero || null,
            complemento || null,
            bairro || null,
            cidade || null,
            uf || null,
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
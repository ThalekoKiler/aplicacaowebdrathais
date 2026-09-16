const pool = require('../config/database');

const AppointmentModel = {
    // READ ALL
    async findAll() {
        const query = `
            SELECT 
                a.id,
                a.paciente_id,
                u.nome AS paciente_nome,
                u.telefone AS paciente_telefone,
                a.procedimento_id,
                p.nome AS procedimento_nome,
                p.duracao_minutos,
                a.data_hora_inicio,
                a.data_hora_fim,
                a.estado,
                a.is_emergencia,
                a.observacao,
                a.criado_em
            FROM agendamentos a
            INNER JOIN usuarios u ON a.paciente_id = u.id
            INNER JOIN procedimento p ON a.procedimento_id = p.id
            ORDER BY a.data_hora_inicio ASC
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // READ BY ID
    async findById(id) {
        const query = `
            SELECT 
                a.id,
                a.paciente_id,
                u.nome AS paciente_nome,
                u.telefone AS paciente_telefone,
                a.procedimento_id,
                p.nome AS procedimento_nome,
                p.duracao_minutos,
                a.data_hora_inicio,
                a.data_hora_fim,
                a.estado,
                a.is_emergencia,
                a.observacao,
                a.criado_em
            FROM agendamentos a
            INNER JOIN usuarios u ON a.paciente_id = u.id
            INNER JOIN procedimento p ON a.procedimento_id = p.id
            WHERE a.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    },

    // Checar conflitos de horário
    async checkConflict(inicio, fim, excludeId = null) {
        let query = `
            SELECT id FROM agendamentos
            WHERE estado != 'CANCELADO'
              AND (? < data_hora_fim AND ? > data_hora_inicio)
        `;
        const params = [inicio, fim];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await pool.query(query, params);
        return rows.length > 0;
    },

    // CREATE
    async create({ paciente_id, procedimento_id, data_hora_inicio, data_hora_fim, estado, is_emergencia, observacao }) {
        const query = `
            INSERT INTO agendamentos 
                (paciente_id, procedimento_id, data_hora_inicio, data_hora_fim, estado, is_emergencia, observacao)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            paciente_id,
            procedimento_id,
            data_hora_inicio,
            data_hora_fim,
            estado || 'AGENDADO',
            is_emergencia || 0,
            observacao || null
        ]);
        return result.insertId;
    },

    // UPDATE COMPLETO (reagendamento, edição de dados)
    async update(id, { procedimento_id, data_hora_inicio, data_hora_fim, estado, is_emergencia, observacao }) {
        const query = `
            UPDATE agendamentos 
            SET 
                procedimento_id = COALESCE(?, procedimento_id),
                data_hora_inicio = COALESCE(?, data_hora_inicio),
                data_hora_fim = COALESCE(?, data_hora_fim),
                estado = COALESCE(?, estado),
                is_emergencia = COALESCE(?, is_emergencia),
                observacao = COALESCE(?, observacao)
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [
            procedimento_id || null,
            data_hora_inicio || null,
            data_hora_fim || null,
            estado || null,
            is_emergencia !== undefined ? is_emergencia : null,
            observacao || null,
            id
        ]);
        return result.affectedRows > 0;
    },

    // UPDATE RÁPIDO DE ESTADO (ex: marcar como CONCLUIDO ou CANCELADO)
    async updateEstado(id, estado) {
        const [result] = await pool.query(
            'UPDATE agendamentos SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    },

    // DELETE
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM agendamentos WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = AppointmentModel;
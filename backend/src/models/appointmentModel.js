const pool = require('../config/database');

const AppointmentModel = {
    // Listar todos os agendamentos com dados do paciente e procedimento
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

    // Buscar agendamento por ID
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

    // Verificar se há conflito de horário na agenda
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

    // Criar novo agendamento
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

    // Atualizar estado (AGENDADO, CONCLUIDO, CANCELADO)
    async updateEstado(id, estado) {
        const [result] = await pool.query(
            'UPDATE agendamentos SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = AppointmentModel;
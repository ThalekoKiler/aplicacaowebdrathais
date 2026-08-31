const pool = require('../config/database');

const RecordModel = {
    // Buscando prontuário por ID do paciente
    async findByPatientId(pacienteId) {
        const query = `
      SELECT 
        pr.id,
        pr.paciente_id,
        u.nome AS paciente_nome,
        u.email AS paciente_email,
        u.telefone AS paciente_telefone,
        pr.anamnese,
        pr.historico_tratamento,
        pr.controle_protose,
        pr.follow_up_evolucao,
        pr.atualizado_em
      FROM prontuarios pr
      INNER JOIN usuarios u ON pr.paciente_id = u.id
      WHERE pr.paciente_id = ?
    `;
        const [rows] = await pool.query(query, [pacienteId]);
        return rows[0];
    },

    // Criando prontuário inicial
    async create({ paciente_id, anamnese, historico_tratamento, controle_protose, follow_up_evolucao }) {
        const query = `
      INSERT INTO prontuarios 
        (paciente_id, anamnese, historico_tratamento, controle_protose, follow_up_evolucao)
      VALUES (?, ?, ?, ?, ?)
    `;
        const [result] = await pool.query(query, [
            paciente_id,
            anamnese || null,
            historico_tratamento || null,
            controle_protose || null,
            follow_up_evolucao || null
        ]);
        return result.insertId;
    },

    // Atualizando prontuário
    async updateByPatientId(pacienteId, { anamnese, historico_tratamento, controle_protose, follow_up_evolucao }) {
        const query = `
      UPDATE prontuarios 
      SET 
        anamnese = COALESCE(?, anamnese),
        historico_tratamento = COALESCE(?, historico_tratamento),
        controle_protose = COALESCE(?, controle_protose),
        follow_up_evolucao = COALESCE(?, follow_up_evolucao)
      WHERE paciente_id = ?
    `;
        const [result] = await pool.query(query, [
            anamnese || null,
            historico_tratamento || null,
            controle_protose || null,
            follow_up_evolucao || null,
            pacienteId
        ]);
        return result.affectedRows > 0;
    }
};

module.exports = RecordModel;
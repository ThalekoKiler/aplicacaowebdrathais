const pool = require('../config/database');

const RecordModel = {
  // READ ALL
  async findAll() {
    const query = `
            SELECT 
                pr.id,
                pr.paciente_id,
                u.nome AS paciente_nome,
                u.email AS paciente_email,
                u.telefone AS paciente_telefone,
                pr.anamnese,
                pr.historico_tratamento,
                pr.controle_protese,
                pr.follow_up_evolucao,
                pr.atualizado_em
            FROM prontuarios pr
            INNER JOIN usuarios u ON pr.paciente_id = u.id
            ORDER BY pr.atualizado_em DESC
        `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // READ BY PACIENTE ID
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
                pr.controle_protese,
                pr.follow_up_evolucao,
                pr.atualizado_em
            FROM prontuarios pr
            INNER JOIN usuarios u ON pr.paciente_id = u.id
            WHERE pr.paciente_id = ?
        `;
    const [rows] = await pool.query(query, [pacienteId]);
    return rows[0];
  },

  // CREATE
  async create({ paciente_id, anamnese, historico_tratamento, controle_protese, follow_up_evolucao }) {
    const query = `
            INSERT INTO prontuarios 
                (paciente_id, anamnese, historico_tratamento, controle_protese, follow_up_evolucao)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.query(query, [
      paciente_id,
      anamnese || null,
      historico_tratamento || null,
      controle_protese || null,
      follow_up_evolucao || null
    ]);
    return result.insertId;
  },

  // UPDATE
  async updateByPatientId(pacienteId, { anamnese, historico_tratamento, controle_protese, follow_up_evolucao }) {
    const query = `
            UPDATE prontuarios 
            SET 
                anamnese = COALESCE(?, anamnese),
                historico_tratamento = COALESCE(?, historico_tratamento),
                controle_protese = COALESCE(?, controle_protese),
                follow_up_evolucao = COALESCE(?, follow_up_evolucao)
            WHERE paciente_id = ?
        `;
    const [result] = await pool.query(query, [
      anamnese || null,
      historico_tratamento || null,
      controle_protese || null,
      follow_up_evolucao || null,
      pacienteId
    ]);
    return result.affectedRows > 0;
  },

  // DELETE
  async deleteByPatientId(pacienteId) {
    const [result] = await pool.query(
      'DELETE FROM prontuarios WHERE paciente_id = ?',
      [pacienteId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = RecordModel;
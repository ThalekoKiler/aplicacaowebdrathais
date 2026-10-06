const RecordModel = require('../models/recordModel');

const RecordController = {
    // READ ALL (exclusivo do ADMIN)
    async getAll(req, res) {
        try {
            const user = req.user;

            if (user && user.tipo !== 'CLINICA') {
                return res.status(403).json({ error: 'Acesso negado: apenas admins podem listar todos os prontuários!' });
            }

            const records = await RecordModel.findAll();
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar prontuários', details: error.message });
        }
    },

    // READ BY PACIENTE ID
    async getByPatientId(req, res) {
        try {
            const pacienteId = Number(req.params.pacienteId);
            const user = req.user;

            if (!pacienteId) {
                return res.status(400).json({ error: 'ID do paciente inválido' });
            }

            // Se for paciente, só pode consultar o seu próprio prontuário
            if (user && user.tipo === 'PACIENTE' && user.id !== pacienteId) {
                return res.status(403).json({ error: 'Acesso negado: você não tem permissão para acessar este prontuário' });
            }

            const record = await RecordModel.findByPatientId(pacienteId);

            if (!record) {
                return res.status(404).json({ error: 'Prontuário não encontrado para este paciente!' });
            }

            return res.status(200).json(record);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar prontuário', details: error.message });
        }
    },

    // CREATE (Apenas ADMIN/Dentista pode criar prontuário)
    async create(req, res) {
        try {
            const user = req.user;
            if (user && user.tipo !== 'CLINICA') {
                return res.status(403).json({ error: 'Acesso negado: apenas administradores podem criar prontuários' });
            }

            const { paciente_id, anamnese, historico_tratamento, controle_protese, follow_up_evolucao } = req.body;

            if (!paciente_id) {
                return res.status(400).json({ error: 'paciente_id é obrigatório!' });
            }

            const existingRecord = await RecordModel.findByPatientId(paciente_id);
            if (existingRecord) {
                return res.status(409).json({ error: 'Este paciente já possui prontuário cadastrado!' });
            }

            const newId = await RecordModel.create({
                paciente_id,
                anamnese,
                historico_tratamento,
                controle_protese,
                follow_up_evolucao
            });

            return res.status(201).json({ id: newId, message: 'Prontuário criado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar prontuário', details: error.message });
        }
    },

    // UPDATE (Apenas ADMIN/Dentista pode atualizar prontuários)
    async update(req, res) {
        try {
            const user = req.user;
            if (user && user.tipo !== 'CLINICA') {
                return res.status(403).json({ error: 'Acesso negado: apenas administradores podem atualizar prontuários' });
            }

            const pacienteId = Number(req.params.pacienteId);
            const { anamnese, historico_tratamento, controle_protese, follow_up_evolucao } = req.body;

            const updated = await RecordModel.updateByPatientId(pacienteId, {
                anamnese,
                historico_tratamento,
                controle_protese,
                follow_up_evolucao
            });

            if (!updated) {
                return res.status(404).json({ error: 'Prontuário não encontrado para atualização!' });
            }

            return res.status(200).json({ message: 'Prontuário atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar prontuário', details: error.message });
        }
    },

    // DELETE (Apenas ADMIN/Dentista pode exlcuir prontuário)
    async delete(req, res) {
        try {
            const user = req.user;
            if (user && user.tipo !== 'CLINICA') {
                return res.status(403).json({ error: 'Acesso negado: apenas administradores podem excluir prontuários' });
            }

            const pacienteId = Number(req.params.pacienteId);
            const deleted = await RecordModel.deleteByPatientId(pacienteId);

            if (!deleted) {
                return res.status(404).json({ error: 'Prontuário não encontrado para exclusão!' });
            }

            return res.status(200).json({ message: 'Prontuário excluído com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir prontuário', details: error.message });
        }
    }
};

module.exports = RecordController;
const RecordModel = require('../models/recordModel');

const RecordController = {
    // Buscando prontuário por ID
    async getByPatientId(req, res) {
        try {
            const pacienteId = parseInt(req.params.pacienteId, 10);

            if (isNaN(pacienteId)) {
                return res.status(400).json({ error: 'ID do paciente inválido' });
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

    // Criando prontuário inicial
    async create(req, res) {
        try {
            const { paciente_id, anamnese, historico_tratamento, controle_protese, follow_up_evolucao } = req.body;

            if (!paciente_id) {
                return res.status(400).json({ error: 'paciente_id é obrigatório! ' });
            }

            // Checa se o paciente já possuí prontuário
            const existingRecord = await RecordModel.findByPatientId(paciente_id);
            if (existingRecord) {
                return res.status(409).json({ error: 'Este paciente já possui prontuário cadastrado! ' });
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

    // Atualizando prontuário
    async update(req, res) {
        try {
            const { pacienteId } = req.params;
            const { anamnese, historico_tratamento, controle_protese, follow_up_evolucao } = req.body;

            const updated = await RecordModel.updateByPatientId(pacienteId, {
                anamnese,
                historico_tratamento,
                controle_protese,
                follow_up_evolucao
            });

            if (!updated) {
                return res.status(404).json({ error: 'Prontuário não encontrado para atualização! ' });
            }

            return res.status(200).json({ message: 'Prontuário atualizado com sucesso! ' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar prontuário', details: error.message });
        }
    }
};

module.exports = RecordController;
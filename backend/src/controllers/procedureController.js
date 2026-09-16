const ProcedureModel = require('../models/procedureModel');

const ProcedureController = {
    async getAll(req, res) {
        try {
            const procedures = await ProcedureModel.findAll();
            return res.status(200).json(procedures);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar procedimentos', details: error.message });
        }
    },

    async create(req, res) {
        try {
            const { nome, descricao, duracao_minutos } = req.body;
            if (!nome) {
                return res.status(400).json({ error: 'Nome do procedimento é obrigatório!' });
            }

            const id = await ProcedureModel.create({ nome, descricao, duracao_minutos });
            return res.status(201).json({ id, message: 'Procedimento cadastrado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar procedimento', details: error.message });
        }
    }
};

module.exports = ProcedureController;
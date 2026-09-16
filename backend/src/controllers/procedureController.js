const ProcedureModel = require('../models/ProcedureModel');

const ProcedureController = {
    // READ ALL
    async getAll(req, res) {
        try {
            const procedures = await ProcedureModel.findAll();
            return res.status(200).json(procedures);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar procedimentos', details: error.message });
        }
    },

    // READ BY ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const procedure = await ProcedureModel.findById(id);

            if (!procedure) {
                return res.status(404).json({ error: 'Procedimento não encontrado!' });
            }

            return res.status(200).json(procedure);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar procedimento!', details: error.message });
        }
    },

    // CREATE
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
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, duracao_minutos } = req.body;

            if (!nome) {
                return res.status(400).json({ error: 'Nome do procedimento é obrigatório!' });
            }

            const updated = await ProcedureModel.update(id, { nome, descricao, duracao_minutos });

            if (!updated) {
                return res.status(404).json({ error: 'Procedimento não encontrado para atualização!' });
            }

            return res.status(200).json({ message: 'Procedimento atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar procedimento!', details: error.message });
        }
    },

    // DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProcedureModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Procedimento não encontrado para exclusão!' });
            }

            return res.status(200).json({ message: 'Procedimento excluído com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluír procedimento!', details: error.message });
        }
    }
};

module.exports = ProcedureController;
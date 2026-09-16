const UserModel = require('../models/userModel');

const UserController = {
    // Listando usuarios
    async getAll(req, res) {
        try {
            const users = await UserModel.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
        }
    },

    // Buscando por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
        }
    },

    // Criando Usuário
    async create(req, res) {
        try {
            const { nome, email, senha, telefone, tipo } = req.body;

            if (!nome || !email || !senha || !telefone) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos ' });
            }

            // Verifica duplicidade de email
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'E-mail já cadastrado' });
            }

            const newUserId = await UserModel.create({ nome, email, senha, telefone, tipo });
            return res.status(201).json({ id: newUserId, message: 'Usuário criado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
        }
    },

    // UPDATE 
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, telefone, tipo } = req.body;

            if (!nome || !email || !telefone) {
                return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios para atualização!' });
            }

            // Verificando se o email informado já pertence a outro usuário
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser && existingUser.id !== Number(id)) {
                return res.status(409).json({ error: 'Este email já está em uso por outro usuário!' });
            }

            const updated = await UserModel.update(id, { nome, email, senha, telefone, tipo });
            if (!updated) {
                return res.status(404).json({ error: 'Usuário não encontrado para atualização!' });
            }

            return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar usuário!', details: error.message });
        }
    },

    // DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await UserModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Usuário não encontrado para exclusão!' });
            }

            return res.status(200).json({ message: 'Usuário excluído com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluír um usuário!', details: error.message });
        }
    }
};

module.exports = UserController;
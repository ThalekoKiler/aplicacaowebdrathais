const UserModel = require('../models/userModel');
const authHelper = require('../helpers/authHelper');
const createUserToken = require('../helpers/create-user-token');

const UserController = {
    // Consulta pública da API ViaCep
    async getAddressByCep(req, res) {
        try {
            const { cep } = req.params;
            const cleanCep = cep.replace(/\D/g, ''); // remove traços e pontos

            if (cleanCep.length !== 8) {
                return res.status(400).json({ error: 'CEP inválido. Deve conter 8 dígitos' });
            }

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                return res.status(404).json({ error: 'CEP não encontrado!' });
            }

            return res.status(200).json({
                cep: data.cep,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                uf: data.uf
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao consultar serviço de CEP', details: error.message });
        }
    },

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
            const {
                nome,
                email,
                senha,
                telefone,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                tipo
            } = req.body;

            if (!nome || !email || !senha || !telefone) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos!' });
            }

            // Verificar duplicidade do email
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email já cadastrado, utilize outro Email!' });
            }

            // Passa a senha em texto pro Model, que vai criptografar internamente
            const newUserId = await UserModel.create({
                nome,
                email,
                senha,
                telefone,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                tipo: tipo ? tipo.toUpperCase() : 'PACIENTE'
            });

            const newUser = await UserModel.findById(newUserId);
            return createUserToken(newUser, req, res);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar um usuário', details: error.message });
        }
    },

    // Login do Usuário e Emissão do Token JWT
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(422).json({ message: 'Email e senha são obrigatórios!' });
            }

            // Buscando usuário por Email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(422).json({ message: 'Não há usuário cadastrado com esse email' });
            }

            // Confere a senha com o hash guardado no banco
            const isPasswordValid = await authHelper.comparePassword(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(422).json({ message: 'Senha inválida!' });
            }

            await createUserToken(user, req, res);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao realizar login!', details: error.message });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nome,
                email,
                senha,
                telefone,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                tipo
            } = req.body;

            if (!nome || !email || !telefone) {
                return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios para atualização!' });
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser && existingUser.id !== Number(id)) {
                return res.status(409).json({ error: 'Este email já está em uso por outro usuário!' });
            }

            const updated = await UserModel.update(id, {
                nome,
                email,
                senha, // O Model verifica se existe e faz o hash se necessário
                telefone,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                tipo: tipo ? tipo.toUpperCase() : undefined
            });

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
            return res.status(500).json({ error: 'Erro ao excluir um usuário!', details: error.message });
        }
    }
};

module.exports = UserController;
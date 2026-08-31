const AppointmentModel = require('../models/AppointmentModel');
const ProcedureModel = require('../models/ProcedureModel'); // Recomendado para manter o MVC limpo

const AppointmentController = {
    // Listar todos os agendamentos
    async getAll(req, res) {
        try {
            const appointments = await AppointmentModel.findAll();
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar agendamentos', details: error.message });
        }
    },

    // Buscar agendamento por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const appointment = await AppointmentModel.findById(id);

            if (!appointment) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            return res.status(200).json(appointment);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar agendamento', details: error.message });
        }
    },

    // Criar agendamento
    async create(req, res) {
        try {
            const { paciente_id, procedimento_id, data_hora_inicio, is_emergencia, observacao } = req.body;

            if (!paciente_id || !procedimento_id || !data_hora_inicio) {
                return res.status(400).json({ error: 'paciente_id, procedimento_id e data_hora_inicio são obrigatórios' });
            }

            // Busca duração via Model em vez de query direta no controller
            const procedimento = await ProcedureModel.findById(procedimento_id);

            if (!procedimento) {
                return res.status(404).json({ error: 'Procedimento informado não existe' });
            }

            // Regra de Negócio: Emergência dura 15min ou pega o padrão do procedimento
            const duracao = is_emergencia ? 15 : procedimento.duracao_minutos;
            const dataInicio = new Date(data_hora_inicio);
            const dataFim = new Date(dataInicio.getTime() + duracao * 60000);

            // Checa conflito de horário
            const hasConflict = await AppointmentModel.checkConflict(dataInicio, dataFim);
            if (hasConflict) {
                return res.status(409).json({ error: 'Horário indisponível. Já existe consulta agendada neste intervalo.' });
            }

            const newId = await AppointmentModel.create({
                paciente_id,
                procedimento_id,
                data_hora_inicio: dataInicio,
                data_hora_fim: dataFim,
                estado: 'AGENDADO',
                is_emergencia: is_emergencia ? 1 : 0,
                observacao
            });

            return res.status(201).json({ id: newId, message: 'Agendamento realizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar agendamento', details: error.message });
        }
    },

    // Alterar estado
    async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const validStates = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
            if (!validStates.includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido. Use: AGENDADO, CONCLUIDO ou CANCELADO' });
            }

            const updated = await AppointmentModel.updateEstado(id, estado);
            if (!updated) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            return res.status(200).json({ message: 'Estado atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar estado', details: error.message });
        }
    }
};

module.exports = AppointmentController;
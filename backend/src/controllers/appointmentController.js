const AppointmentModel = require('../models/appointmentModel');
const ProcedureModel = require('../models/procedureModel');

const AppointmentController = {
    // READ ALL
    async getAll(req, res) {
        try {
            const appointments = await AppointmentModel.findAll();
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar agendamentos', details: error.message });
        }
    },

    // READ BY ID
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

    // CREATE
    async create(req, res) {
        try {
            const { paciente_id, procedimento_id, data_hora_inicio, is_emergencia, observacao } = req.body;

            if (!paciente_id || !procedimento_id || !data_hora_inicio) {
                return res.status(400).json({ error: 'paciente_id, procedimento_id e data_hora_inicio são obrigatórios' });
            }

            const procedimento = await ProcedureModel.findById(procedimento_id);
            if (!procedimento) {
                return res.status(404).json({ error: 'Procedimento informado não existe' });
            }

            const duracao = is_emergencia ? 15 : procedimento.duracao_minutos;
            const dataInicio = new Date(data_hora_inicio);
            const dataFim = new Date(dataInicio.getTime() + duracao * 60000);

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

    // UPDATE GERAL (Reagendamento ou edição de campos)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { procedimento_id, data_hora_inicio, estado, is_emergencia, observacao } = req.body;

            const existing = await AppointmentModel.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Agendamento não encontrado para atualização' });
            }

            let dataInicio = existing.data_hora_inicio;
            let dataFim = existing.data_hora_fim;
            const procId = procedimento_id || existing.procedimento_id;

            if (data_hora_inicio || procedimento_id || is_emergencia !== undefined) {
                const procedimento = await ProcedureModel.findById(procId);
                const emerg = is_emergencia !== undefined ? is_emergencia : existing.is_emergencia;
                const duracao = emerg ? 15 : (procedimento ? procedimento.duracao_minutos : 30);

                dataInicio = data_hora_inicio ? new Date(data_hora_inicio) : new Date(existing.data_hora_inicio);
                dataFim = new Date(dataInicio.getTime() + duracao * 60000);

                const hasConflict = await AppointmentModel.checkConflict(dataInicio, dataFim, id);
                if (hasConflict) {
                    return res.status(409).json({ error: 'Horário indisponível para reagendamento.' });
                }
            }

            const updated = await AppointmentModel.update(id, {
                procedimento_id: procId,
                data_hora_inicio: dataInicio,
                data_hora_fim: dataFim,
                estado,
                is_emergencia: is_emergencia !== undefined ? (is_emergencia ? 1 : 0) : undefined,
                observacao
            });

            if (!updated) {
                return res.status(400).json({ error: 'Nenhuma alteração realizada' });
            }

            return res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar agendamento', details: error.message });
        }
    },

    // UPDATE STATUS RÁPIDO
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
    },

    // DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await AppointmentModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Agendamento não encontrado para exclusão' });
            }

            return res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir agendamento', details: error.message });
        }
    }
};

module.exports = AppointmentController;
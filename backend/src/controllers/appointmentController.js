const AppointmentModel = require('../models/appointmentModel');
const ProcedureModel = require('../models/procedureModel');

const AppointmentController = {
    // READ ALL (Se for paciente, traz só as dele; se for admin, traz todas)
    async getAll(req, res) {
        try {
            const user = req.user;

            if (user && user.tipo === 'PACIENTE') {
                const appointments = await AppointmentModel.findByPacienteId(user.id);
                return res.status(200).json(appointments);
            }

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
            const user = req.user;
            const appointment = await AppointmentModel.findById(id);

            if (!appointment) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            // Paciente não pode ver agendamento de outro paciente
            if (user && user.tipo === 'PACIENTE' && appointment.paciente_id !== user.id) {
                return res.status(403).json({ error: 'Acesso negado a este agendamento' });
            }

            return res.status(200).json(appointment);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar agendamento', details: error.message });
        }
    },

    // CREATE
    async create(req, res) {
        try {
            const { procedimento_id, data_hora_inicio, is_emergencia, observacao } = req.body;
            const user = req.user;

            // Se for admin e enviou paciente_id no body usa ele, senão pega direto do usuário logado
            const paciente_id = (user.tipo === 'CLINICA' && req.body.paciente_id) ? req.body.paciente_id : user.id;

            if (!paciente_id || !procedimento_id || !data_hora_inicio) {
                return res.status(400).json({ error: 'procedimento_id e data_hora_inicio são obrigatórios' });
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
            const user = req.user;

            const existing = await AppointmentModel.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Agendamento não encontrado para atualização' });
            }

            // Paciente só pode atualizar o seu próprio agendamento
            if (user && user.tipo === 'PACIENTE' && existing.paciente_id !== user.id) {
                return res.status(403).json({ error: 'Você não tem permissão para alterar este agendamento' });
            }

            // Define o procedimento e a data inicial a ser usada (nova ou a que já estava salva)
            const procId = procedimento_id || existing.procedimento_id;
            const dataBaseInicio = data_hora_inicio ? new Date(data_hora_inicio) : new Date(existing.data_hora_inicio);

            // Verifica se houve alteração de horário, procedimento ou emergência
            const precisaRecalcular = Boolean(data_hora_inicio || procedimento_id || is_emergencia !== undefined);

            if (precisaRecalcular) {
                const procedimento = await ProcedureModel.findById(procId);
                const duracaoMinutos = (is_emergencia ?? existing.is_emergencia) ? 15 : (procedimento ? procedimento.duracao_minutos : 30);
                const dataFimCalculada = new Date(dataBaseInicio.getTime() + duracaoMinutos * 60000);

                const hasConflict = await AppointmentModel.checkConflict(dataBaseInicio, dataFimCalculada, id);
                if (hasConflict) {
                    return res.status(409).json({ error: 'Horário indisponível para reagendamento.' });
                }

                const updated = await AppointmentModel.update(id, {
                    procedimento_id: procId,
                    data_hora_inicio: dataBaseInicio,
                    data_hora_fim: dataFimCalculada,
                    estado,
                    is_emergencia: is_emergencia !== undefined ? (is_emergencia ? 1 : 0) : undefined,
                    observacao
                });

                if (!updated) {
                    return res.status(400).json({ error: 'Nenhuma alteração realizada' });
                }

                return res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
            }

            // Se não mexeu em horários/procedimento, atualiza apenas os outros campos
            const updated = await AppointmentModel.update(id, {
                procedimento_id,
                estado,
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
            const user = req.user;

            const validStates = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
            if (!validStates.includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido. Use: AGENDADO, CONCLUIDO ou CANCELADO' });
            }

            const existing = await AppointmentModel.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            // Paciente só pode alterar o estado do próprio agendamento (ex: cancelar)
            if (user && user.tipo === 'PACIENTE' && existing.paciente_id !== user.id) {
                return res.status(403).json({ error: 'Você não tem permissão para alterar este agendamento' });
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
            const user = req.user;

            const existing = await AppointmentModel.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Agendamento não encontrado para exclusão' });
            }

            // Paciente só pode deletar se for dele
            if (user && user.tipo === 'PACIENTE' && existing.paciente_id !== user.id) {
                return res.status(403).json({ error: 'Você não tem permissão para excluir este agendamento' });
            }

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
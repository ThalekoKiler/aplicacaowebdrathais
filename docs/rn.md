# ⚖️ Regras de Negócio (RN)

As regras de negócio definem as políticas, restrições e lógicas operacionais da clínica aplicadas ao sistema.

- **[RN001] Horário de Funcionamento:**
  - Segunda a Sexta: 09:00 às 19:30.
  - Sábado: 09:00 às 14:00.
  - Domingos e Feriados: Agenda fechada por padrão.

- **[RN002] Duração Variável de Consultas:**
  - **Procedimento Padrão:** Duração fixa de 1 hora (60 minutos).
  - **Procedimentos Complexos (ex: Extrações):** Duração fixa de 1 hora e meia (90 minutos).
  - **Procedimentos Especiais (ex: Lente em Resina):** Bloqueio de turno fechado completo (Manhã ou Tarde).

- **[RN003] Prevenção de Conflito de Horários:** O sistema não pode permitir mais de uma consulta no mesmo horário para o mesmo dentista/consultório.

- **[RN004] Priorização de Emergência:** Consultas marcadas sob a flag "Dor Aguda / Emergência" devem passar na frente da fila de atendimento ou acionar alerta de encaixe imediato para a recepção.

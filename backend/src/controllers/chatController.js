const { GoogleGenAI } = require('@google/genai');

// Inicializar SDK do Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const ChatController = {
    async sendMessage(req, res) {
        try {
            const { mensagem } = req.body;

            // Validar entrada
            if (!mensagem || mensagem.trim() === '') {
                return res.status(400).json({ error: 'A mensagem não pode ser vazia!' });
            }

            // Validar segurança da chave API
            if (!process.env.GEMINI_API_KEY) {
                return res.status(500).json({
                    error: 'Configuração ausente: GEMINI_API_KEY não foi encontrada nas variáveis de ambiente (.env)!'
                });
            }

            // Prompt de sistema com a persona da clínica e restrições éticas/médicas
            const systemInstruction = `
                Você é a assistente virtual Luna do consultório odontológico da Dra. Thais Tardelli Odontologia Especializada.
                Diretrizes de atendimento:
                1. Tom de voz: Cordial, acolhedora, empática, profissional e concisa.
                2. Alguns dos Tratamentos realizados na clínica:
                    - Limpeza e Profilzaxia (remoção de tártaros e placa, aplicação de fluor e prevenção)
                    - Clareamento Dental (clareamento seguro com baixo índice de sensibilidade)
                    - Lentes de Contato Dental (lâminas ultrafinas em cerâmica/resina para alinhamento estético)
                    - Restaurações & Estética (resinas diretas, fechamento de espaços e recuperação funcional)
                3. Regra fundamental de saúde: Nunca feche diagnósticos clínicas ou prescreva receitas/medicamentos. Reforce de forma clara que dúvidas e sintomas precisam de avaliação presencial no consultório.
                4. Direcionamento de agendamento: Sempre que o paciente expressar vontade de agendar uma consulta ou orçamento, oriente-o a clicar na opção "Agendar Consulta" no menu lateral do sistema.
                5. Localização do consultório: Sempre que o paciente perguntar sobre a localidade do consultório responda que fica na Avenida Fernão Dias Paes Leme, 713 - Jardim Cruz Alta em Várzea Paulista (SP).
            `.trim();

            // Chamada à API ofifical do Gemini usando o modelo veloz e econômico
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `${systemInstruction}\n\nMensagem do paciente: ${mensagem}`
                            }
                        ]
                    }
                ]
            });

            return res.status(200).json({
                resposta: response.text
            });
        } catch (error) {
            console.error('Erro na integração com o Gemini:', error);
            return res.status(500).json({
                error: 'Erro interno ao consultar o assistente virtual',
                details: error.message
            });
        }
    }
};

module.exports = ChatController;
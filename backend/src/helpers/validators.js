const { body, validationResult } = require('express-validator');

// Intercepta e devolve os erros em formato JSON caso alguma regra falhe
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validação para cadastro de Usuário
const validateUserCreation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório!')
        .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres!'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email informado é inválido!')
        .normalizeEmail(),
    body('senha')
        .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres!'),
    body('telefone')
        .trim()
        .notEmpty().withMessage('Telefone é obrigatório'),
    body('tipo')
        .optional()
        .isIn(['PACIENTE', 'CLINICA']).withMessage('Tipo deve ser PACIENTE ou CLINICA'),
    handleValidationErrors
];

// Validação para criação de Agendamento
const validateAppointmentCreation = [
    body('paciente_id')
        .isInt({ min: 1 }).withMessage('paciente_id deve ser um número inteiro válido'),
    body('procedimento_id')
        .isInt({ min: 1 }).withMessage('procedimento_id deve ser um número inteiro válido'),
    body('data_hora_inicio')
        .isISO8601().withMessage('data_hora_inicio deve ser uma data/hora válida (ex: 2026-08-27T10:00:00)'),
    body('is_emergencia')
        .optional()
        .isBoolean().withMessage('is_emergencia deve ser verdadeiro ou falso (boolean)'),
    handleValidationErrors
];

module.exports = {
    validateUserCreation,
    validateAppointmentCreation
};
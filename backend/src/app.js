const express = require('express');
const cors = require('cors')

const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const procedureRoutes = require('./routes/procedureRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/usuarios', userRoutes);
app.use('/agendamentos', appointmentRoutes);
app.use('/prontuarios', recordRoutes);
app.use('/procedimentos', procedureRoutes);
app.use('/chat', chatRoutes);

// Isso aq servirá só para testar se a API está rodando e Online
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'API Online funcionando!' });
});

module.exports = app;
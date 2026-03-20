require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();

// conectar banco
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// rotas
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/external', externalRoutes);

// iniciar servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
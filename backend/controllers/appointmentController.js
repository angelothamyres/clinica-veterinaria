const Appointment = require('../models/Appointment');
const { getWeatherForecast } = require('./externalController');

const createAppointment = async (req, res) => {
  try {
    const { patientName, patientEmail, specialty, petName, date, time, cep, address } = req.body;

    const existingAppointment = await Appointment.findOne({
      specialty,
      date,
      time,
      status: { $ne: 'cancelada' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Já existe uma consulta marcada para esse horário.' });
    }

    const weatherAlert = await getWeatherForecast(date);

    const appointment = await Appointment.create({
      patientName,
      patientEmail,
      specialty,
      petName,
      date,
      time,
      cep,
      address,
      weatherAlert,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Consulta agendada com sucesso!',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao agendar consulta.', error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar consultas.', error: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdBy: req.user.id }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar suas consultas.', error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Consulta não encontrada.' });
    }

    if (
      req.user.role !== 'secretario' &&
      appointment.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    appointment.status = 'cancelada';
    await appointment.save();

    res.json({ message: 'Consulta cancelada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar consulta.', error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Consulta não encontrada.' });
    }

    if (
      req.user.role !== 'secretario' &&
      appointment.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Consulta excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir consulta.', error: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Consulta não encontrada.' });
    }

    if (
      req.user.role !== 'secretario' &&
      appointment.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const conflict = await Appointment.findOne({
      _id: { $ne: req.params.id },
      specialty: appointment.specialty,
      date,
      time,
      status: { $ne: 'cancelada' }
    });

    if (conflict) {
      return res.status(400).json({ message: 'Esse novo horário já está ocupado.' });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'remarcada';
    appointment.weatherAlert = await getWeatherForecast(date);

    await appointment.save();

    res.json({ message: 'Consulta remarcada com sucesso.', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remarcar consulta.', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getMyAppointments,
  cancelAppointment,
  deleteAppointment,
  rescheduleAppointment
};
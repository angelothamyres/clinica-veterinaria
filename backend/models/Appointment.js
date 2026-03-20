const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  specialty: { type: String, required: true },
  petName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  cep: { type: String, required: true },
  address: { type: String, required: true },
  weatherAlert: { type: String, default: '' },
  status: {
    type: String,
    enum: ['agendada', 'cancelada', 'remarcada'],
    default: 'agendada'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
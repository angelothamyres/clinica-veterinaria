const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getMyAppointments,
  cancelAppointment,
  deleteAppointment,
  rescheduleAppointment
} = require('../controllers/appointmentController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createAppointment);
router.get('/my', authMiddleware, getMyAppointments);
router.get('/', authMiddleware, adminMiddleware, getAppointments);

router.put('/:id/cancel', authMiddleware, cancelAppointment);
router.put('/:id/reschedule', authMiddleware, rescheduleAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;
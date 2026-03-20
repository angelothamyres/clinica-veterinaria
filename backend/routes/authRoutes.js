const express = require('express');
const router = express.Router();
const { register, login, getPatients } = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/patients', authMiddleware, adminMiddleware, getPatients);

module.exports = router;
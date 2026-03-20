const express = require('express');
const router = express.Router();
const { getAddressByCep } = require('../controllers/externalController');

router.get('/cep/:cep', getAddressByCep);

module.exports = router;
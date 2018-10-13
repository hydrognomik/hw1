const express = require('express');

const getStatus = require('../controllers/status.js');

const router = express.Router();

router.get('/', getStatus);

module.exports = router;

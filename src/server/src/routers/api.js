const express = require('express');

const { getEvents, getEventsByType } = require('../controllers/api');
const getData = require('../middlewares/get-data');

const router = express.Router();

router.use(getData);

router.get('/events', getEvents);

router.post('/events', getEventsByType);

module.exports = router;

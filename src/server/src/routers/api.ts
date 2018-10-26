import express from 'express';

import { getEvents, getEventsByType } from '../controllers/api';
import getData from '../middlewares/get-data';

const router = express.Router();

router.use(getData);

router.get('/events', getEvents);

router.post('/events', getEventsByType);

export default router;

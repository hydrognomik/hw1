import express from 'express';

import getStatus from '../controllers/status';

const router = express.Router();

router.get('/', getStatus);

export default router;

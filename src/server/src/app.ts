import express, { Request, Response } from 'express';
import cors from 'cors';
import { urlencoded } from 'body-parser';

const app = express();

export default app;

import api from './routers/api';
import status from './routers/status';

app.use(cors());
app.use(urlencoded({ extended: false }));

app.use('/status', status);
app.use('/api', api);

app.use(function(req: Request, res: Response) {
  res.status(404).send('<h1>Page not found</h1>');
});

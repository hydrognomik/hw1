import { Request, Response } from 'express';

import app from '../app';

const getUpTime = (): string => {
  const runningTime = Date.now() - app.get('serverStart');
  const diff = new Date();

  diff.setTime(runningTime)
  return diff.toLocaleString('en-GB', { timeZone: 'UTC' });
}

const getStatus = (req: Request, res: Response): void => {
  res.status(200).send(getUpTime());
};

export default getStatus;

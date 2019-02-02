import fs from 'fs';

import { NextFunction, Request, Response } from 'express';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const getData = (req: Request, res: Response, next: NextFunction) => {
  readFile('events.json', 'utf8')
    .then((data: string) => {
      res.locals.eventsData = data;
      next();
    })
    .catch((err: string) => {
      res.status(500).send(err);
    });
};

export default getData;

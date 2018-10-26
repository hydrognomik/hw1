import fs from 'fs';
import { promisify } from 'util';
import { Request, Response } from 'express';

const readFile = promisify(fs.readFile);

const getData = (req: Request, res: Response, next: Function) => {
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

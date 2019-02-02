import { Request, Response } from 'express';

interface IEvent {
  type: string;
}

export const getEvents = (req: Request, res: Response) => {
  res.set('Content-Type', 'application/json');
  res.status(200).send(res.locals.eventsData);
};

export const getEventsByType = (req: Request, res: Response) => {
  const { events } = JSON.parse(res.locals.eventsData);

  const types = req.body.type && req.body.type.split(':');
  const availableTypes = events.reduce((acc: string[], { type }: IEvent): string[] => {
    if (!acc.includes(type)) {
      acc.push(type);
    }
    return acc;
  }, []);
  const isTypeCorrect = types
    && types.every((type: string) => availableTypes.includes(type));

  if (!isTypeCorrect) {
    res.status(400).send('Incorrect type');
  }

  const filteredEvents = events.filter(({ type }: IEvent) => types.includes(type));

  res.status(200).json({ events: filteredEvents });
};

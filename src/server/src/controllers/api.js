const getEvents = (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).send(res.locals.eventsData);
};

const getEventsByType = (req, res) => {
  const { events } = JSON.parse(res.locals.eventsData);

  const types = req.body.type && req.body.type.split(':');
  const availableTypes = events.reduce((acc, { type }) => {
    if (!acc.includes(type)) {
      acc.push(type);
    }
    return acc;
  }, []);
  const isTypeCorrect = types
    && types.every(type => availableTypes.includes(type));

  if (!isTypeCorrect) {
    res.status(400).send('Incorrect type');
  }

  const filteredEvents = events.filter(({ type }) => types.includes(type));

  res.status(200).json({ events: filteredEvents });
};

module.exports = {
  getEvents,
  getEventsByType
};

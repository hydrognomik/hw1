const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const getData = (req, res, next) => {
  readFile('events.json', 'utf8')
    .then(data => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.locals.eventsData = data;
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = getData;

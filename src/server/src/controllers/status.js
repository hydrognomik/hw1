const app = require('../app');
const { msToTime } = require('../utils');

const getStatus = (req, res) => {
  const runningTime = Date.now() - app.get('serverStart');

  res.status(200).send(msToTime(runningTime));
};

module.exports = getStatus;

const express = require('express');
const { urlencoded } = require('body-parser');

const app = express();

module.exports = app;

const api = require('./routers/api');
const status = require('./routers/status');

app.use(urlencoded({ extended: false }));

app.use('/status', status);
app.use('/api', api);

app.use(function(req, res) {
  res.status(404).send('<h1>Page not found</h1>');
});

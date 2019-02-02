import app from './app';

app.listen(8000, () => {
  app.set('serverStart', Date.now());
  // eslint-disable-next-line no-console
  console.log('Home work listening on port 8000.');
});

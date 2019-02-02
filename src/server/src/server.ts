import app from './app';

app.listen(8000, () => {
  app.set('serverStart', Date.now());
  process.stdout.write('Home work listening on port 8000.\n');
});

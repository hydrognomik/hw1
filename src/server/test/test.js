const request = require('supertest');

const app = require('../src/app');

describe('SHRI Node.js home work', () => {
  describe('/status', () => {
    it('should response on /status/ endpoint', () => request(app)
      .get('/status/')
      .then(response => {
        expect(response.statusCode).toBe(200);
      }));
  });

  describe('/api', () => {
    describe('/events', () => {
      it('should response with all 11 events', () => request(app)
        .get('/api/events/')
        .then(response => {
          const { statusCode, body } = response;

          expect(statusCode).toBe(200);
          expect(body.events.length).toBe(11);
        })
      );

      it('should response with two filtered events', () => request(app)
        .post('/api/events/')
        .send('type=critical')
        .then(response => {
          const { statusCode, body } = response;

          expect(statusCode).toBe(200);
          expect(body.events.length).toBe(2);
        })
      );

      it('should response with 11 filtered events', () => request(app)
        .post('/api/events/')
        .send('type=info:critical')
        .then(response => {
          const { statusCode, body } = response;

          expect(statusCode).toBe(200);
          expect(body.events.length).toBe(11);
        }));

      it('should response 400 "Incorrect type" on multiple filter', () => request(app)
        .post('/api/events/')
        .send('type=info:critical:foo')
        .then(response => {
          const { statusCode, text } = response;

          expect(statusCode).toBe(400);
          expect(text).toBe('Incorrect type');
        })
      );

      it('should response 400 "Incorrect type" on single filter', () => request(app)
        .post('/api/events/')
        .send('type=foo')
        .then(response => {
          const { statusCode, text } = response;

          expect(statusCode).toBe(400);
          expect(text).toBe('Incorrect type');
        })
      );
    });
  });

  it('should response 404 on unexisting routes', () => request(app)
    .get('/foo')
    .then(response => {
      const { statusCode, text } = response;

      expect(statusCode).toBe(404);
      expect(text).toBe('<h1>Page not found</h1>');
    })
  );
});

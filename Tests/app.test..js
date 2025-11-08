// tests/app.test.js
const request = require(‘supertest’);
const app = require(’../app’);

describe(‘API Endpoints’, () => {
// Test the health check endpoint
it(‘should return 200 on health check’, async () => {
const res = await request(app).get(’/health’);
expect(res.statusCode).toEqual(200);
expect(res.body).toHaveProperty(‘status’, ‘ok’);
});

// Test the realtool endpoint
it(‘should return realtool data’, async () => {
const res = await request(app).get(’/api/realtool’);
expect(res.statusCode).toEqual(200);
expect(res.body).toHaveProperty(‘Realtool’);
expect(res.body.Realtool).toHaveProperty(‘FocusAreas’);
});

// Test property analysis with invalid data
it(‘should return 400 with invalid real estate data’, async () => {
const res = await request(app)
.post(’/api/property-analysis’)
.send({ property: { id: ‘test’ } }); // Missing required fields

```
expect(res.statusCode).toEqual(400);
expect(res.body).toHaveProperty('errors');
```

});

// Test the scraper endpoint with missing URL
it(‘should return 400 when scraper URL is missing’, async () => {
const res = await request(app).get(’/api/scrape’);
expect(res.statusCode).toEqual(400);
expect(res.body).toHaveProperty(‘error’, ‘Missing ?url=’);
});

// Test the chat endpoint with missing prompt
it(‘should return 400 when chat prompt is missing’, async () => {
const res = await request(app)
.post(’/api/chat’)
.send({});

```
expect(res.statusCode).toEqual(400);
expect(res.body).toHaveProperty('error', 'Please provide a "prompt" in JSON');
```

});
});

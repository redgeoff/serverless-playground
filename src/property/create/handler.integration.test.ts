import config from '../../config-test';

// Note: we are using fetch instead of supertest as fetch is browser supported standard and provides
// nearly the same feature set as supertest.
import fetch from 'node-fetch';

it('should create property', async () => {
  const property = await fetch(`${config.apiURL}/property`, {
    body: JSON.stringify({ name: 'ABC' }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(res => res.json());
  expect(property).toEqual({ id: 'ABC', name: 'ABC' });
});

import config from '../../config-test';

// Note: we are using fetch instead of supertest as fetch is browser supported standard and provides
// nearly the same feature set as supertest.
import fetch from 'node-fetch';

it('should get availability', async () => {
  const availability = await fetch(
    `${config.apiURL}/property/1234/availability`
  ).then(res => res.json());
  expect(availability).toEqual({ foo: 'bar', propertyId: '1234' });
});

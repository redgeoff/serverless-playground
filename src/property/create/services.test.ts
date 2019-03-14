import { createProperty, getProperty } from './services';

it('should create and get property', async () => {
  const property = await createProperty({ name: 'ABC' });
  expect(property).toEqual({
    id: 'ABC',
    name: 'ABC',
  });

  expect(await getProperty('ABC')).toEqual(property);
});

import { availability } from './services';

it('should get availability', async () => {
  expect(await availability('1234')).toMatchSnapshot();

  await expect(availability('123')).rejects.toEqual(new Error('cannot be 123'));
});

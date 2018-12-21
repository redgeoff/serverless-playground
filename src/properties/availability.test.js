import availability, { isValid } from './availability';

describe('availability', () => {
  it('executes as expected', async () => {
    expect(await availability({ pathParameters: { propertyId: '1234' } }, {})).toMatchSnapshot();
  });

  it('is valid', async () => {
    expect(await isValid({ propertyId: 'aaa' })).toEqual(false)
    // TODO: ...
  })
});

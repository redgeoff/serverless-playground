import availability, { foo, isValid } from './availability';

describe('availability', () => {
  it('executes as expected', async () => {
    expect(await availability({ pathParameters: { propertyId: '1234' } }, {})).toMatchSnapshot();
  });

  it('is valid', async () => {
    expect(await isValid({ propertyId: 'aaa' })).toEqual(false);
    // TODO: ...
  });

  it('should foo', () => {
    // function yo(cool: string) {
    //   return cool;
    // }
    // expect(foo());
    expect('bar').toEqual('bar');
  });
});

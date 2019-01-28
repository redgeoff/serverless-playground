import availability, { foo, validate } from './availability';

// describe('availability', () => {
it('executes as expected', async () => {
  expect(await availability({ pathParameters: { propertyId: 1234 } }, {})).toMatchSnapshot();
});

// With yup
// it('is valid', async () => {
//   expect(await isValid({ propertyId: 'aaa' })).toEqual(false);
//   // TODO: ...
// });

it('is valid', async () => {
  const validated = await validate({ propertyId: 'aaa' });
  expect(validated.valid).toEqual(false);
  // TODO: ...
});

it('should foo', () => {
  // function yo(cool: string) {
  //   return cool;
  // }
  // expect(foo());
  expect('bar').toEqual('bar');
});
// });

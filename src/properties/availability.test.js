import availability from './availability';

describe('availability', () => {
  it('executes as expected', async () => {
    expect(await availability({}, {})).toMatchSnapshot();
  });
});

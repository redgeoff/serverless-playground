import hello from './hello';

describe('hello', () => {
  it('executes as expected', async () => {
    expect(await hello({}, {})).toMatchSnapshot();
  });
});

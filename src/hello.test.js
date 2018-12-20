import hello from './hello';

describe('hello', () => {
  it('executes as expected', async () => {
    const cb = jest.fn();
    await hello({}, {}, cb);
    expect(cb).toBeCalled();
    expect(cb).toMatchSnapshot();
  });
});

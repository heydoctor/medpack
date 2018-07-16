import quantumpack from '../src';

describe('quantumpack', () => {
  test('defaults to development', () => {
    expect(quantumpack()).toMatchSnapshot();
  });

  test('production', () => {
    expect(
      quantumpack({
        mode: 'production',
      })
    ).toMatchSnapshot();
  });
});

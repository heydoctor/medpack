import medpack from '../src/medpack';

describe('medpack', () => {
  test('defaults to development', () => {
    expect(medpack()).toMatchSnapshot();
  });

  test('production', () => {
    expect(
      medpack({
        mode: 'production',
      })
    ).toMatchSnapshot();
  });
});

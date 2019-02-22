import medpack, { IMedpack } from '../src/medpack';

describe('medpack', () => {
  describe('development', () => {
    let pack: IMedpack;
    beforeEach(() => {
      pack = medpack();
    })

    test('defaults to development', () => {
      expect(pack.config.mode).toEqual('development');
    });
  })

  describe('production', () => {
    test('set production mode', () => {
      const pack = medpack({
        mode: 'production',
      })
      expect(pack.config.mode).toEqual('production');
    });

    test('can provide custom entry', () => {
      const pack = medpack({
        mode: 'production',
        webpack: config => {
          config.entry = ['testentry'];
          return config;
        }
      })

      expect(pack.config.entry).toContain('testentry');
    });
  })
});

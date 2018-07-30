import webpackBase from '../src/config/webpack.base';
import webpackDev from '../src/config/webpack.dev';

const paths = {};
const env = {};

const base = webpackBase({ paths, env });

test('webpack.dev', () => {
  expect(webpackDev({ base, paths, env })).toMatchSnapshot();
});

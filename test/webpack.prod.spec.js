import webpackBase from '../src/config/webpack.base';
import webpackProd from '../src/config/webpack.prod';

const paths = {};
const env = {};

const base = webpackBase({ paths, env });

test('webpack.prod', () => {
  expect(webpackProd({ base, paths, env })).toMatchSnapshot();
});

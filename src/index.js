const merge = require('lodash/merge');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./config/webpack.base');
const webpackDev = require('./config/webpack.dev');
const webpackProd = require('./config/webpack.prod');
const defaultPaths = require('./config/paths');
const getEnv = require('./config/env');

module.exports = ({
  mode = process.env.NODE_ENV,
  devPublicUrl = '/',
  prodPublicUrl = '',
  sourceMaps = true,
  paths = {},
  env: customEnv = {},
  webpack: customWebpack = a => a,
} = {}) => {
  const isProd = mode === 'production';
  const publicUrl = isProd ? prodPublicUrl : devPublicUrl;

  const options = {
    mode,
    sourceMaps,
    publicUrl,
    paths: merge(defaultPaths, paths),
    env: merge(getEnv(publicUrl), customEnv),
  };

  const baseConfig = webpackBase(options);
  const envConfig = isProd ? webpackProd(options) : webpackDev(options);

  const config = customWebpack(webpackMerge(baseConfig, envConfig));

  return {
    config,
    paths: options.paths,
    env: options.env,
  };
};

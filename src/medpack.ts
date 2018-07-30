import { merge } from 'lodash';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import webpackBase from './config/webpack.base';
import webpackDev from './config/webpack.dev';
import webpackProd from './config/webpack.prod';
import defaultPaths, { IPaths } from './config/paths';
import getEnv from './config/env';

export interface IMedpackOptions {
  mode?: "development" | "production",
  publicUrl?: string,
  sourceMaps?: boolean,
  paths?: IPaths,
  env?: Object,
  webpack?: (config: Configuration) => Configuration
}

export interface IMedpack {
  config: Configuration,
  paths: IPaths,
  env: Object
}

export default ({
  mode = process.env.NODE_ENV || 'development',
  publicUrl = '',
  sourceMaps = true,
  paths: customPaths,
  env: customEnv = {},
  webpack: customWebpack = a => a,
}: IMedpackOptions = {}): IMedpack => {
  const prod = mode === 'production';
  const paths = merge(defaultPaths, customPaths);
  const env = merge(getEnv(publicUrl), customEnv)

  const options = {
    mode,
    sourceMaps,
    publicUrl,
    paths,
    env,
  };

  const baseConfig = webpackBase(options);
  const envConfig = prod ? webpackProd(options) : webpackDev(options);
  const config = customWebpack(webpackMerge(baseConfig, envConfig));

  return {
    config,
    paths,
    env,
  };
};

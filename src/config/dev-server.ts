import { Application } from 'express';
import { Configuration } from 'webpack'
import { Configuration as DevServerConfig, ProxyConfigMap } from 'webpack-dev-server'
// @ts-ignore
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
// @ts-ignore
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
// @ts-ignore
import ignoredFiles from 'react-dev-utils/ignoredFiles';
import { IPaths } from './paths';

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

interface IDevServer {
  config: Configuration,
  paths: IPaths,
  proxy: ProxyConfigMap | undefined,
  allowedHosts: string
}

export default ({ config, paths, proxy, allowedHosts }: IDevServer): DevServerConfig => {
  return {
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    publicPath: config.output ? config.output.publicPath: '/',
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    https: protocol === 'https',
    host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHosts,
    proxy,
    before(app: Application) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  };
};

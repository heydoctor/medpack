import { Configuration } from 'webpack';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin  from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin  from 'uglifyjs-webpack-plugin';
import { IWebpackConfig } from './types';

export default ({ paths, sourceMaps }: IWebpackConfig): Configuration => {
  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  const publicPath = paths.servedPath || '/';

  return {
    mode: 'production',
    bail: true,
    entry: [`${__dirname}/polyfills`, paths.appIndexJs],
    output: {
      // The build folder.
      path: paths.appBuild,

      publicPath,
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    },
    devtool: sourceMaps ? 'source-map' : false,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
            },
            output: {
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: sourceMaps,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    ],
  };
};

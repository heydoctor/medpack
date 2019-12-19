import path from 'path';
import webpack, { Configuration, Loader } from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { ILooseObject, IWebpackConfig } from './types';

const stringifyEnv = (raw: ILooseObject): { [k: string]: Object } => ({
  'process.env': Object.keys(raw).reduce((env: ILooseObject, key: string) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
  }, {}),
});

// Style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// Default Webpack configuration
// @see: https://webpack.js.org/configuration/
export default ({ mode, paths, env, sourceMaps }: IWebpackConfig): Configuration => {
  const isProd = mode === 'production';

  // Common function to get style loaders
  const enableSourceMaps = isProd && sourceMaps;

  const getStyleLoaders = (cssOptions: Object, preProcessor: string = ''): Array<Loader> => {
    const loaders = [
      {
        loader: 'css-loader',
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: 'postcss-loader',
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              flexbox: 'no-2009',
            }),
          ],
          sourceMap: enableSourceMaps,
        },
      },
    ];

    if (isProd) {
      // @ts-ignore
      loaders.unshift(MiniCssExtractPlugin.loader);
    } else {
      // @ts-ignore
      loaders.unshift('style-loader');
    }

    if (preProcessor) {
      loaders.push({
        loader: preProcessor,
        options: {
          sourceMap: enableSourceMaps,
        },
      });
    }
    return loaders.filter(Boolean);
  };

  return {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    output: {
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            chunks: 'initial',
            priority: -10,
            name: 'vendors',
          },
          'async-vendors': {
            test: /node_modules/,
            minChunks: 2,
            chunks: 'async',
            priority: 0,
            name: 'async-vendors',
          },
        },
      },
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: {
        name: 'manifest',
      },
    },
    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX and some ESnext features.
            {
              test: /(js|jsx|ts|tsx)$/,
              // include: paths.srcPaths,
              exclude: /node_modules/,
              use: [
                // This loader parallelizes code compilation, it is optional but
                // improves compile time on larger projects
                {
                  loader: 'thread-loader',
                  options: {
                    poolTimeout: Infinity, // keep workers alive for more effective watch mode
                  },
                },
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      [
                        '@babel/env',
                        {
                          useBuiltIns: 'entry',
                          modules: false,
                        },
                      ],
                      ['@babel/react', { development: !isProd, useBuiltIns: true }],
                      ['@babel/typescript'],
                    ],
                    plugins: [
                      ['@babel/plugin-proposal-decorators', { legacy: true }],
                      '@babel/plugin-transform-destructuring',
                      ['@babel/plugin-proposal-class-properties', { loose: true }],
                      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
                      [
                        '@babel/plugin-transform-runtime',
                        {
                          helpers: false,
                          regenerator: true,
                        },
                      ],
                      '@babel/plugin-syntax-dynamic-import',
                      '@babel/plugin-proposal-export-default-from',
                      'babel-plugin-lodash',
                      'react-hot-loader/babel',
                      '@babel/plugin-proposal-optional-chaining',
                    ],
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: false,
                    highlightCode: true,
                  },
                },
              ],
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: enableSourceMaps,
              }),
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: enableSourceMaps,
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
                localsConvention: 'camelCase',
              }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // Chains the sass-loader with the css-loader and the style-loader
            // to immediately apply all styles to the DOM.
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders({ importLoaders: 2, sourceMap: enableSourceMaps }, 'sass-loader'),
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: enableSourceMaps,
                  modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                  localsConvention: 'camelCase',
                },
                'sass-loader'
              ),
            },
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
              loader: 'file-loader',
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),

      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      // In production, it will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),

      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV was set to production here.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(stringifyEnv(env)),

      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: '/',
      }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  };
};

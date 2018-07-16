const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

// Style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const stringifyEnv = raw => ({
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(env[key]);
    return env;
  }, {}),
});

// Default Webpack configuration
// @see: https://webpack.js.org/configuration/
module.exports = ({ mode, paths, env, sourceMaps }) => {
  // Common function to get style loaders
  const enableSourceMaps = mode === 'production' && sourceMaps;

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      mode === 'production' && MiniCssExtractPlugin.loader,
      mode !== 'production' && require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
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
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: enableSourceMaps,
        },
      });
    }
    return loaders.filter(Boolean);
  };

  return {
    output: {
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendors',
      },
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
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
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, and some ESnext features.
            {
              test: /(js|jsx)$/,
              // include: paths.srcPaths,
              exclude: /node_modules/,
              use: [
                // This loader parallelizes code compilation, it is optional but
                // improves compile time on larger projects
                {
                  loader: require.resolve('thread-loader'),
                  options: {
                    poolTimeout: Infinity, // keep workers alive for more effective watch mode
                  },
                },
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      [require.resolve('@babel/preset-env'), { useBuiltIns: 'entry', modules: false }],
                      [require.resolve('@babel/preset-react'), { development: mode === 'development', useBuiltIns: true }],
                    ],
                    plugins: [
                      require.resolve('@babel/plugin-transform-destructuring'),
                      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
                      [require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
                      [
                        require.resolve('@babel/plugin-transform-runtime'),
                        {
                          helpers: false,
                          polyfill: false,
                          regenerator: true,
                        },
                      ],
                      require.resolve('@babel/plugin-syntax-dynamic-import'),
                      require.resolve('@babel/plugin-proposal-export-default-from'),
                    ],
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    highlightCode: true,
                  },
                },
              ],
            },
            // Allows you to use two kinds of imports for SVG:
            // import logoUrl from './logo.svg'; gives you the URL.
            // import { ReactComponent as Logo } from './logo.svg'; gives you a component.
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    babelrc: false,
                    presets: [
                      require.resolve('@babel/preset-env'),
                      require.resolve('@babel/preset-react')
                    ],
                    cacheDirectory: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash:8].[ext]',
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
                modules: true,
                camelCase: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
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
                  modules: true,
                  camelCase: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
                'sass-loader'
              ),
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
      new InterpolateHtmlPlugin(env),
      new webpack.DefinePlugin(stringifyEnv(env)),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: '/',
      }),
    ],

    stats: {
      // Don't print noisy output for extracted CSS children.
      children: false,
    },
  };
};

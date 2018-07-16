const quantumpack = require('../src');

module.exports = quantumpack({
  mode: process.env.NODE_ENV || 'development',
  paths: {
    appHtml: `${__dirname}/index.html`,
    appIndexJs: `${__dirname}/index.js`,
  },
});

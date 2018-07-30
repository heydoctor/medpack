import medpack from '../lib/medpack';

export default medpack({
  mode: process.env.NODE_ENV || 'development',
  paths: {
    appHtml: `${__dirname}/index.html`,
    appIndexJs: `${__dirname}/index.js`,
  },
});

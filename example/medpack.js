import medpack from '../lib/medpack';
import dotenv from 'dotenv';

dotenv.config();

export default medpack({
  mode: process.env.NODE_ENV || 'development',
  env: {
    FROM_ENV: process.env.FROM_ENV,
  },
  paths: {
    appHtml: `${__dirname}/index.html`,
    appIndexJs: `${__dirname}/index.js`,
  },
});

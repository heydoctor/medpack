import path from 'path';
import medpack, { IMedpack } from './medpack';

export const getConfig = (configPath: string): IMedpack => {
  const resolvedPath = path.resolve(configPath);

  try {
    const config = require(resolvedPath);
    return config.default || config;
  } catch(err) {
    return medpack();
  }
}

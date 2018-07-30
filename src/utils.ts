import { existsSync } from 'fs';
import {resolve} from 'path';
import medpack, { IMedpack } from './medpack';

export const getConfig = (configPath: string = ''): IMedpack => {
  const resolvedPath = resolve(configPath);

  if (existsSync(resolvedPath)) {
    const config = require(resolvedPath);
    return config.default || config;
  }

  return medpack();
}

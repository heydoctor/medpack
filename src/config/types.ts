import { IPaths } from './paths';

export interface ILooseObject {
  [k: string]: string | undefined
}

export interface IWebpackConfig {
  mode: string,
  paths: IPaths,
  env: ILooseObject,
  sourceMaps: boolean,
}

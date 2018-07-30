#!/usr/bin/env node

import '@babel/register';
import findUp from 'find-up';
import start, { StartOptions } from './scripts/start';
import build, { BuildOptions } from './scripts/build';

require('yargs') // eslint-disable-line
  .command(
    'start',
    'Start webpack dev server',
    () => {},
    (argv: StartOptions) => {
      start(argv);
    }
  )
  .command(
    'build',
    'Build application',
    () => {},
    (argv: BuildOptions) => {
      build(argv);
    }
  )
  .option('config', {
    alias: 'c',
    default: findUp.sync('medpack.js'),
  }).argv;

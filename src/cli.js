#!/usr/bin/env node

const start = require('./scripts/start');
const build = require('./scripts/build');
const test = require('./scripts/test');
const findUp = require('find-up');

require('yargs') // eslint-disable-line
  .command(
    'start',
    'Start webpack dev server',
    () => {},
    argv => {
      start(argv);
    }
  )
  .command(
    'build',
    'Build application',
    () => {},
    argv => {
      build(argv);
    }
  )
  .option('config', {
    alias: 'c',
    default: findUp.sync('quantumpack.js'),
  }).argv;

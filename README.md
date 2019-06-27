# ⛑ Medpack [![npm version](https://badge.fury.io/js/medpack.svg)](http://badge.fury.io/js/medpack) [![Build Status](https://travis-ci.org/heydoctor/medpack.svg?branch=master)](https://travis-ci.org/heydoctor/medpack) [![codecov](https://codecov.io/gh/heydoctor/medpack/branch/master/graph/badge.svg)](https://codecov.io/gh/heydoctor/medpack) [![Greenkeeper badge](https://badges.greenkeeper.io/heydoctor/medpack.svg)](https://greenkeeper.io/)
> Zero-to-slim config webpack wrapper

## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [Commands](#commands)
  - [Hot Reloading](#hot-reloading)

## Installation
```sh
$ yarn add --dev medpack
$ npm install --save-dev medpack
```


## Usage
Medpack *just works* out of the box. If you need more flexibility, add a `medpack.js` config file to the root of your directory:

```js
import medpack from 'medpack'

export default medpack({
  paths: {
    appPath: './src/entry.js',
  },
  env: {
    SHOW_DEBUG: true,
  },
  webpack: config => {
    config.entry = ['src/random.js', ...config.entry];

    return config;
  }
})
```

## Commands
- `medpack start` - Spins up your local development server with [hot reloading](#hot-reloading) enabled
- `medpack build` - Creates a production-optimized build ready to be distributed
- `medpack test` - Runs your tests with jest

## Hot Reloading
Medpack uses [react-hot-loader](https://github.com/gaearon/react-hot-loader) under the hood . Opt-in to hot reloading by wrapping your top most component with the `hot` HOC.

```jsx
// App.js
import { hot } from 'react-hot-loader/root'
const App = () => <div>Hello World!</div>
export default hot(App);
```

> Note: in production, `hot` does nothing and just passes App through.

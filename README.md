```js
// quantumpack.js

import quantumpack from 'quantumpack'

export default quantumpack({
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

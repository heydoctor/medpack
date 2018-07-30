```js
// medpack.js

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

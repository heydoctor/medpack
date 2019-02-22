import React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderApp = Component => render(<Component />, document.getElementById('root'))

renderApp(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderApp(NextApp);
  });
}

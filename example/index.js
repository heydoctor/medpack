import React from 'react';
import { render } from 'react-dom';
import Counter from './counter';
import './index.scss';
import styles from './index.module.scss';
import logo from './logo.svg';

class App extends React.Component {
  render() {
    return (
      <div>
        <img src={logo} alt="" width="100" />
        <h1 className={styles.pageTitle}>Hello medpack!</h1>
        <Counter />
      </div>
    );
  }
}

const rootEl = document.getElementById('root');

render(<App />, rootEl);

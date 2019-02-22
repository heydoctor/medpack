import React from 'react';
import { render } from 'react-dom';
import Counter from './components/Counter';
import './index.scss';
import styles from './index.module.scss';
import logo from './logo.svg';

function App() {
  return (
    <>
      <img src={logo} alt="" width="100" />
      <h1 className={styles.pageTitle}>Hello medpack!</h1>
      <Counter />
      <br />
      <span>We can also use the environment variables you make available in medpack.js:</span>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </>
  )
}

const rootEl = document.getElementById('root');

render(<App />, rootEl);

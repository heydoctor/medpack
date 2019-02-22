import React from 'react';
import { hot } from 'react-hot-loader/root';
import Counter from './components/Counter';
import './App.scss';
import styles from './App.module.scss';
import logo from './logo.svg';

function App() {
  return (
    <>
      <img src={logo} alt="" width="100" />
      <h1 className={styles.pageTitle}>Hello Medpack!</h1>
      <p>This page is setup for hot reloading. Update the counter and change anything in this file. You should see your page updates, along with the counter retaining its state.</p>
      <Counter />
      <br />
      <span>We can also use the environment variables you make available in medpack.js:</span>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </>
  )
}

export default hot(App);

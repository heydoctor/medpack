import React from 'react';
import Counter from './components/Counter';
import './App.scss';
import styles from './App.module.scss';
import logo from './logo.svg';

export default function App() {
  return (
    <>
      <img src={logo} alt="" width="100" />
      <h1 className={styles.pageTitle}>Hello dff!</h1>
      <Counter />
      <br />
      <span>We can also use the environment variables you make available in medpack.js:</span>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </>
  )
}

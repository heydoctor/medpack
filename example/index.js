import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import styles from './index.module.scss';

const App = () => <h1 className={styles.title}>Hello Quantumpack!</h1>;

const rootEl = document.getElementById('root');

render(<App />, rootEl);

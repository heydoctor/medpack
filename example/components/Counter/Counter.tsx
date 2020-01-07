import React, { useState } from 'react';
import styles from './Counter.module.scss';

export default function Counter() {
  const [counter, setCounter] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button className={styles.button} onClick={() => setCounter(counter - 1)}>-</button>
      <span className={styles.counter}>{counter}</span>
      <button className={styles.button} onClick={() => setCounter(counter + 1)}>+</button>
    </div>
  )
}

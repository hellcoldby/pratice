/* eslint-disable no-restricted-globals,@typescript-eslint/no-unused-vars */
import { useState} from 'react'

import reactLogo from './assets/react.svg'
import styles from './App.module.less';
import Monaco from './components/monaco';
import Test from './components/test';

function App({}) {
  const [count, setCount] = useState(0);

  function handleTest(){
    setCount(count+1)
  }

  return (
    <div >

      <div className={styles.app}>
        <div >
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className={styles.logo} alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className={`${styles.logo} ${styles.react}`} alt="React logo" />
          </a>
        </div>
        <h1 onClick={handleTest}>Vite + React</h1>
        <Test num={count} ></Test>
      </div>
      <Monaco/>
    </div>
  )
}

export default App

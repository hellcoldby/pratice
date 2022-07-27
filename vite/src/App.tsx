/* eslint-disable no-restricted-globals,@typescript-eslint/no-unused-vars */
import { useState, useEffect} from 'react'
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';


import reactLogo from './assets/react.svg'
import styles from './App.module.less';

//在web works 中只有self 可以取到全局对象
self.MonacoEnvironment = {
  getWorker(_, label) {
      if (label === 'json') {
          return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
          return new tsWorker();
      }
      return new editorWorker();
  },
};

interface InsType {
  [key:string]:any
}

let instance:InsType;
function App({}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    instance = monaco.editor.create(document.getElementById('monaco')as HTMLElement, {
        value: `/** 
    输入代码测试
*/`,
        language: 'javascript',  //
        automaticLayout: true
    });

    instance.onDidChangeModelContent(() => {
      // 获取到当前编辑内容
      // onChange(instance.getValue())
    })

    //销毁实例
    return ()=>{
      instance.dispose();
    }
  }, []);

  const showContent = () => {
    alert(instance.getValue());
  };

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
        <h1>Vite + React</h1>
        <div className={styles.card}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMRRRR
          </p>
        </div>
        <p className={styles['read-the-docs']}>
          Click on the Vite and React logos to learn more
        </p>
      </div>
      <div className={styles.box}>
         <div className={styles.monaco} id='monaco'></div>
         <button onClick={showContent}>获取输入内容</button>
      </div>
    </div>
  )
}

export default App

import { useEffect } from "react";
import styles from './index.module.less';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';


// console.log(self.MonacoEnvironment);

//在web works 中只有self 可以取到全局对象
(self as any).MonacoEnvironment = {
    getWorker(_, label:string) {
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

let example = `/** 
输入代码测试
*/`;

const Editor =()=>{

    useEffect(() => {
        console.log('初始化编辑器');
        instance = monaco.editor.create(document.getElementById('monaco')as HTMLElement, {
            value: example,
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
    return (<div className={styles.box}>
        <div className={styles.monaco} id='monaco'></div>
        <button onClick={showContent}>获取输入内容</button>
     </div>)
}

export default Editor;
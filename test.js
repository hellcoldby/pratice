/*
 * @filename:
 * @Date: 2020-05-26 15:11:32
 * @Author: 汪渊  <yuan.wang07@hand-china.com>
 * @version: 1.0.0
 * @copyright: copyright: HAND ® 2020
 */
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

import MonacoEditor from 'react-monaco-editor';
import * as _monaco from 'monaco-editor';

import styles from './index.less';

let provider = {
  dispose: () => {},
};

interface IRightContent {
  currentRecord: any; // fixme
  handleCheck: () => Promise<boolean>;
  secondRightData: (model.dataSource.BaseDataSourceField | model.dataSource.BaseDataSourceHeader)[];
}


export default forwardRef(({ currentRecord, handleCheck, secondRightData = [] }, ref) => {
   
    const editorInstance = useRef(); // 编辑器实例
    const code = useRef(currentRecord ? currentRecord.formulaContent : '');  // 真实数据
    const cache = useRef(code.current);// 缓存数据
    const [refresh, setRefresh] = React.useState(false);  // 输入引号触发页面刷新
    const monacoInstance = useRef();

    const options = {
      selectOnLineNumbers: true,
      renderSideBySide: false,
    };

    useImperativeHandle(ref, () => ({
      handleSetEditorVal,
  
    }));



    //给编辑器设置值
    const handleSetEditorVal = (value) => {
      if (!value) return;
      // 为所选取的值赋值到编辑器中
      if (editorInstance.current && value) {
        const selection = editorInstance?.current?.getSelection?.();
        const range = new _monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        );
        const id = { major: 1, minor: 1 };
        const op = { identifier: id, range, text: value, forceMoveMarkers: true };
        editorInstance.current.executeEdits('', [op]);
        editorInstance.current.focus();
      }
    };





    // 编辑器change回调
    const onChangeHandle = (val, event  ) => {
      const curWord = event.changes[0].text;
      if (curWord === '"') {
        cache.current = val + curWord;
        setRefresh(!refresh); // 刷新页面
        return;
      }
      cache.current = val;
    };




    //初始化编辑器
    const editorDidMountHandle = (editor, monaco) => {
      
      monacoInstance.current = monaco;
      editorInstance.current = editor;
      const newSecondRightFields = []; //录入数据

      
      secondRightData .forEach((record) => {
        record.fields.forEach((item) => { newSecondRightFields.push(item);});
        code.current = newSecondRightFields; // 数组长度永远为1
      });

      // 提示项设值
      provider = monaco.languages.registerCompletionItemProvider('plaintext', {

        provideCompletionItems() {

          const suggestions= [];
          //处理suggestion 数据
            code.current.forEach((record) => {
              suggestions.push({
                // label未写错 中间加空格为了隐藏大写字段名称 大写字段名称用于规避自定义提示不匹配小写的bug
                label:  '',// 显示名称
                kind: record.kind || monaco.languages.CompletionItemKind.Field, // 这里Function也可以是别的值，主要用来显示不同的图标
                insertText: record.insertText || record.aliasName, // 实际粘贴上的值
                // detail: record.detail || `(property) ${record.aliasName}: String`,
              });
            });
          


          [
            'CASEWHEN(expression1, value1, expression2, value2, ..., else_value)',
            'CONCAT(str1, str2, ...)',
            'ISNULL (expression, defaultValue)',
            'DATEDIFF_YEAR(startdate,enddate)',
            'DATEDIFF_MONTH(startdate,enddate)',
            'DATEDIFF_DAY(startdate,enddate)',
            'SUM(expression)',
            'AVG(expression)',
            'MAX(expression)',
            'MIN(expression)',
            'COUNT(expression)',
            'DISTINCTCOUNT(expression)',
            'DISTINCTAVG(expression)',
            'DISTINCTSUM(expression)',
            'NOW()',
          ].forEach((item) => {
            suggestions.push(
              // 添加contact()函数
              {
                label: item, // 显示名称
                kind: monaco.languages.CompletionItemKind.Function, // 这里Function也可以是别的值，主要用来显示不同的图标
                insertText: item, // 实际粘贴上的值
              }
            );
          });
          return {
            suggestions, // 必须使用深拷贝
          };
        },

        quickSuggestions: false, // 默认提示关闭
        // triggerCharacters: ['$', '.', '='], // 触发提示的字符，可以写多个
     
     
      });
      editor.focus();


    };



    return (
      <>
        <MonacoEditor
          width="100%"
          height="400px"
          language="plaintext"
          value={cache.current}
          options={options}
          onChange={onChangeHandle}
          editorDidMount={editorDidMountHandle}
        />

      </>
    );
  }
)

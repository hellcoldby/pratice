
import React,{Component} from "react";
import Count from './Mobx_counter/index.js';
import Todo from './Mobx_todo/index.js'
import UserList from './Mobx_ref/index.js'
import TestAction from './TestAction/index.js'
import styles from './index.less'

function D(props){
    return <div>
            <h1>mobx测试</h1>
            <ul className={styles.ul}>
                <li> <Count /></li>
                <li> <Todo /></li>
                {/* <UserList/> */}
                <li><TestAction/></li>
                
            </ul>
        </div>
}
export default D
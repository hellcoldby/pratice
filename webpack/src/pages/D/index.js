
import React,{Component} from "react";
import Count from './Mobx_counter/index.js';
import Todo from './Mobx_todo/index.js'
function D(props){
    
    return <>
        <Count {...props}/>
        <Todo {...props}/>
    </>
}


export default D
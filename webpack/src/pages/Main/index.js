import React, { useState, Suspense } from "react";
// import A from "../A";
import pic from "../../public/icon.jpg";
import styles from "./index.less";

import { Provider } from 'mobx-react';
import store from '../../store/index'


// 懒加载要求 必须返回一个promise, resolve 接受一个组件
const A_lazy = React.lazy(()=>{ 
    // return new Promise((resolve)=>{
    //     setTimeout(()=>{
    //         resolve(import(/* webpackChunkName: "pageA" */'../A'))
    //     },2000)
    // })
   return import(/* webpackChunkName: "pageA" */'../A')
});
const B_lazy = React.lazy(() => {
    // return new Promise(resolve=>{
    //     setTimeout(() => {
    //         resolve(import(/* webpackChunkName: "pageB" */'../B'));
    //     }, 2000);
    // })
    return import(/* webpackChunkName: "pageB" */'../B')
});
const C_lazy = React.lazy(()=>{
    return import(/* webpackChunkName:"pageC" */'../C');
});

//测试 mobx 
const D_lazy = React.lazy(()=>{
    return import(/* webpackChunkName:"pageC" */'../D')
})

function Main() {
    const [value, setValue] = useState(0);
    const [sel, setSel] = useState('a');
    // console.log("main");

    function handleLazy(){
        // import('../B/index').then(data=>{
        //     console.log(data);
        // })
        setSel(sel==='a'?'b':'a')
    }

    return (
        <>
            <div style={{ overflow: "hidden" }}>
                <div
                    style={{ width: "300px", border: "1px solid red" }}
                    
                >
                    hello world1!
                    <p onClick={() => {
                        setValue(value === 0 ? 123 : 0);
                    }}>
                        click：---&gt;<button>{value}</button>
                    </p>
                    <p> 父级状态变化 不触发子组件更新 </p>
                   
                    <div >
                        <button onClick={handleLazy}>react.lazy()点击懒加载:</button> 
                        <Suspense fallback={<div>Loading...</div>}>
                            {sel==='a'? <A_lazy/>: <B_lazy/>}
                            <C_lazy/>
                           
                        </Suspense>
                    </div>
                </div>
                <Provider {...store}>
                    <D_lazy />
                </Provider>

                <div style={{display:'flex', marginTop:'50px', border:'1px solid green'}}>
                    <div style={{ float: "left", paddingRight: "50px" }}>
                        <p>背景图</p>
                        <div className={styles.bg}></div>
                    </div>

                    <div style={{ float: "left", paddingRight: "50px" }}>
                        <p>image 图</p>
                        <img src={pic} />
                    </div>
                </div>
            </div>
            <h2 style={{ color: "red" }}>test</h2>
        </>
    );
}
export default Main;

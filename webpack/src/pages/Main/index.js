import React, { useState, Suspense } from "react";
// import A from "../A";
import pic from "../../public/icon.jpg";
import styles from "./index.less";

import { Provider } from 'mobx-react';
import store from '../../store/index'
import E from '../E/index';
import F from '../F/index';


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
                <h1>懒加载测试</h1>
                <div
                    style={{height:'100px', margin:'0 50px', width: "100px", border: "1px solid red" ,display:"flex", justifyContent:'center'}}
                    
                >
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
                {/* <E/> */}
                {/* <F/> */}

                <h1>图片加载测试</h1>
                <div style={{display:'flex', marginTop:'50px', border:'1px solid green', margin:'0 50px'}}>
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
            
        </>
    );
}
export default Main;

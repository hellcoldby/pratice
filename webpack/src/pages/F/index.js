import React,{useState,useMemo,memo} from "react";

/**
 * useMemo --- 测试
 * 
 */

const Child = memo(({data}) =>{
    console.log('child render...', data.name)
    return (
        <div>
            <div>child</div>
            <div>{data.name}</div>
        </div>
    );
})

function F() {
  
    const [count, setCount] = useState(0)
    const [name, setName] = useState('rose')

    const data = useMemo(()=>{
        return {
            name
        }
    },[name])

    return(
        <div>
            <div>
                {count}
            </div>
            {/* <button onClick={()=>setCount(count+1)}>update count </button> */}
            <button onClick={()=>setName('name')}>update name </button>

            <div>{data.name}</div>
            {/* <Child data={data}/> */}
        </div>
    )
}
  
export default F;
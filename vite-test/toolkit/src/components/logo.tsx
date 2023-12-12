
import React, { useEffect,useMemo } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useSelector } from 'react-redux'
const Logo = ()=>{
  const count = useSelector((state) =>{
    if( state.counter.value === 5){
      return  state.counter.value
    }
  })


  

    return <>
        <div>{Math.random()}</div>
        <div>{count}</div>
        <a href="javascript:void">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="javascript:void">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
    </>
}

export default React.memo(Logo) ;
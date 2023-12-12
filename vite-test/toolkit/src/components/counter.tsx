import { useSelector, useDispatch } from 'react-redux'
import {add, sub} from '../store/reducers/a'

 const Counter =() =>{

    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    return         <div>
    <button
      aria-label="Increment value"
      onClick={() => dispatch(add())}
    >
      add
    </button>
    <span>{count}</span>
    <button
      aria-label="Decrement value"
      onClick={() => dispatch(sub())}
    >
      sub
    </button>
  </div>
}

export default Counter;
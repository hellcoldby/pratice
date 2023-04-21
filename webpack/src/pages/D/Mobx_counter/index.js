
import React,{Component} from "react";
import { observer, inject } from 'mobx-react';




//被`observer`包裹的函数式组件会被监听在它每一次调用前发生的任何变化
@inject('counter')
@observer
class Count extends Component {
    get injected() {
        return this.props 
      }
    render() {
        const { counter } = this.injected;
        return <div>
            <div>
                <h2>测试加减</h2>
                <div>count:{counter.count}</div>
                <div>
                    <button onClick={() => counter.increase()}>  ++ </button>
                    <button  onClick={() => counter.decrease()}> -- </button>
                </div>
            </div>
            <div>
                <h2>Todo 测试</h2>

            </div>
        </div>
    }
}

export default Count

import React,{Component} from "react";
import { observer, inject } from 'mobx-react';

//被`observer`包裹的函数式组件会被监听在它每一次调用前发生的任何变化
@inject('counter')
@observer
class Count extends Component {
     componentDidMount(){
       
        setTimeout(() => {
            this.props.counter.count = 100;
        }, 2000);
     }
      
    render() {
        const { counter } = this.props;
        return <div>
            <div>
                <h3>counter测试加减</h3>
                <div>count:{counter.count}</div>
                <p>{this.props.counter.result}</p>
                <div>
                    <button onClick={() => counter.increase()}>  ++ </button>
                    <button  onClick={() => counter.decrease()}> -- </button>
                </div>
                {counter.warning? counter.warning: ''}
            </div>
           
        </div>
    }
}

export default Count
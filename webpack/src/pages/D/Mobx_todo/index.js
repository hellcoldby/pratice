import React,{Component} from "react";
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

@inject('todoList', 'counter')
@observer
class TodoListView extends Component {
    inputCon = '';
    constructor(){
        super();
        this.add = this.add.bind(this);
    }

    add(){
        this.props.todoList.add(this.state.inputCon)
    }

    toggleFinished = todo => {
        this.props.todoList.toggleTodoFinished(todo);
      };

    render (){
      
        return (<div>
            <h3>todo 测试</h3>
             <p>{this.props.counter.result}</p>
            <ul>
                {
                    this.props.todoList.todos.map(todo=>{
                        return <li key={todo.id}>
                            <input
                                type = "checkbox"
                                checked = {todo.finished||false}
                                onChange={()=> this.toggleFinished(todo)}
                            />
                            {todo.title}
                        </li>
                    })
                }
            </ul>
            <label>
            <input type="text" onChange={(e)=>this.setState({inputCon: e.target.value})} />
            <button onClick={this.add}>点击添加列表</button>
            <div>未勾选的列表数量为:{this.props.todoList.unfinishedTodoCount}</div>
            </label>
        </div>)
    }
}

export default TodoListView;
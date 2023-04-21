import React,{Component} from "react";
import { observer, inject } from 'mobx-react';

@inject('todoList')
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

    render (){
      
        return (<div>
            <ul>
                {
                    this.props.todoList.todos.map(todo=>{
                        return <li key={todo.id}>
                            <input
                                type = "checkbox"
                                checked = {todo.finished||false}
                                onChange={()=> (todo.finished = !todo.finished)}
                            />
                            {todo.title}
                        </li>
                    })
                }
            </ul>
            <label>
            <input type="text" onChange={(e)=>this.setState({inputCon: e.target.value})} />
            <button onClick={this.add}>点击添加列表</button>
            </label>
        </div>)
    }
}

export default TodoListView;
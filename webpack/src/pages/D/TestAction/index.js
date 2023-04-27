import React from "react";

import { observer, inject } from "mobx-react";

//被`observer`包裹的函数式组件会被监听在它每一次调用前发生的任何变化
@inject("todoStore")
@observer
class TestAction extends React.Component {
    state = {
        todoText: "",
    };
    constructor(props) {
        super();
        this.todoStore = props.todoStore;
    }

    handleTodoTextChange = (event) => {
        this.setState({
            todoText: event.target.value,
        });
    };

    handleAddTodo = () => {
        const { todoText } = this.state;

        if (todoText) {
            this.todoStore.addTodo(todoText);

            this.setState({
                todoText: "",
            });
        }
    };

    handleClearAll = () => {
        this.todoStore.clearAllTodos();
    };

    handleChangeColor = (...args) => {
        this.debounce(this.todoStore.changeColor)(...args);
    };

    debounce(fn, delay = 300) {
        let timer = null;
        let _this = this;
        return (...args) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(_this, args);
            }, delay);
        };
    }

    render() {
        const { todoText } = this.state;

        return (
            <div>
                <input type="text" placeholder="Enter your todo" value={todoText} onChange={this.handleTodoTextChange} />
                <button onClick={this.handleAddTodo}>Add Todo</button>
                <button onClick={this.handleClearAll}>Clear All</button>

                <ul>
                    {this.todoStore.todos.map((todo) => {
                        const {
                            con: {
                                display: { value, color },
                            },
                        } = todo;
                        return (
                            <li key={todo.id} style={{ margin: "10px", border: `1px solid ${color}` }}>
                                <div style={{ fontWeight: "bolder" }}>
                                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                                        {todo.title}

                                        <div style={{ display: "flex" }}>
                                            <button
                                                style={{ background: `${value ? color : ""}` }}
                                                onClick={() => this.todoStore.changeValue(todo, value)}
                                            >
                                                {value ? "隐藏" : "显示"}更多
                                            </button>
                                        </div>
                                        <div></div>
                                    </div>
                                    {value ? (
                                        <>
                                            <div style={{ color: `${value ? color : ""}` }}>{todo.con.des} </div>
                                            <div style={{ display: "flex" }}>
                                                <span>输入颜色rgb(a)：</span>{" "}
                                                <input type="text" onChange={(e) => this.handleChangeColor(e, todo, color)} />
                                            </div>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <button onClick={() => this.todoStore.removeTodo(todo)}>Remove</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default TestAction;

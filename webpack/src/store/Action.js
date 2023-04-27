/**
 * 
 */

import { observable, action, makeAutoObservable } from 'mobx';

const  getRadNum = ()=>{
    return  Math.floor(Math.random()*256);
}
export default class TodoStore {

  todos =  observable.array([
      {
        id:'aaa',
        title:'aaa',
        con:{des:'aaa的描述', 
          display:{
            value:true,
            color:'green'
          }
        }
        },
      {
        id:'bbb',
        title:'bbb',
        con:{des:'bbb的描述',display:{
          value:false,
          color:'red'
        }}
      }
  ]);

  constructor(){
    // 将数组中的每个对象转换为可观察的
    makeAutoObservable(this)
  }

  @action.bound
  addTodo = (todo) => {
    const default_todo = {
      id: Math.random(),
      title:todo,
      con:{des:`${todo}的描述`, display:{
        value:true,
        color:`rgb(${getRadNum()},${getRadNum()},${getRadNum()})`
      }}
    }
    this.todos.push(default_todo);
  }

  @action.bound
  removeTodo = (todo) => {
    const index = this.todos.indexOf(todo)

    if(index>-1){
      this.todos.splice(index, 1)

    }
  }

  @action.bound
  clearAllTodos = () => {
    this.todos = [];
  }

 @action.bound 
  changeValue(todo) {
    if (todo) {
      todo.con.display.value = !todo.con.display.value;
    }
  }
  @action.bound 
  changeColor(e, todo, oldColor){
   
    if(e.target.value === oldColor) return;
    if (todo) {
      todo.con.display.color = e.target.value
    }
  }
  
}
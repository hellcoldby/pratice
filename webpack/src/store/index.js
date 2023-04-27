
import Counter from './Counter';
import TodoList from './todo';
import TodoStore from './Action';

const store  = {
    counter: new Counter(),
    todoList: new TodoList(),
    todoStore: new TodoStore()
  };
  

export default store;
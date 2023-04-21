
import { makeObservable, computed, observable, action } from 'mobx';
class Todo {
    id = Math.random();
    @observable title;
    @observable finished = false;
    constructor(title) {
      this.title = title;
    }
  }
  
  class TodoList {
    @observable todos = [];
    @computed
    get unfinishedTodoCount() {
      return this.todos.filter(todo => !todo.finished).length;
    }

    @action.bound add(name='one'){
      console.log('oooo');
        this.todos.push(new Todo(name));
    }
  }

  export default TodoList
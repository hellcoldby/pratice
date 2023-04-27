
import { makeObservable,runInAction, computed, observable, action } from 'mobx';
class Todo {
    id = Math.random();
    @observable title;
    @observable finished = false;
    constructor(title) {
      this.title = title;
      makeObservable(this);
    }
    @action.bound toggle() {
      this.finished = !this.finished;
    }
  }
  
  class TodoList {
    @observable todos = observable.array([]);
    @computed
    get unfinishedTodoCount() {
      return this.todos.filter(todo => !todo.finished).length;
    }

    @action.bound add(name='one'){
      const newTodo = new Todo(name);
        this.todos.push(newTodo);
    }
    @action.bound toggleTodoFinished(todo) {
      todo.toggle();
    }
  }

  export default TodoList
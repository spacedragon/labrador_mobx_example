import { observable, computed, action, toJS } from 'mobx';
import generateId from '../utils/generate-id';

export default class TodoStore {

  @observable todos = []
  @computed get finished() {
    return this.todos.filter((t) => t.finished);
  }
  @computed get unfinished() {
    return this.todos.filter((t) => !t.finished);
  }

  @action
  remove(id) {
    let idx = this.todos.findIndex((t) => t.id === id);
    if (idx >= 0) {
      this.todos.splice(idx, 1);
    }
  }

  toJS() {
    return {
      todos: toJS(this.todos),
      finished: toJS(this.finished),
      unfinished: toJS(this.unfinished)
    };
  }

  @action
  finish(id) {
    let todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.finished = true;
    }
    this.finishedCount = this.finished.length;
  }

  @action
  restore(id) {
    let todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.finished = false;
    }
  }

  @action
  create(title) {
    this.todos.push({
      id: generateId(),
      title,
      createdAt: '',
      finished: false,
      finishedAt: ''
    });
  }

}

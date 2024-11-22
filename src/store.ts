import Vue from 'nativescript-vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TodoList {
  id: number;
  name: string;
  todos: Todo[];
}

export class TodoListStore {
  lists: TodoList[] = [];

  addList(name: string) {
    this.lists.unshift({
      id: Date.now(),
      name,
      todos: []
    });
  }

  addTodo(listId: number, text: string) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      list.todos.unshift({
        id: Date.now(),
        text,
        completed: false,
        priority: 'low'
      });
    }
  }

  toggleTodo(listId: number, todoId: number) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      const todo = list.todos.find(t => t.id === todoId);
      if (todo) {
        Vue.set(todo, 'completed', !todo.completed);
      }
    }
  }

  updatePriority(listId: number, todoId: number) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      const todo = list.todos.find(t => t.id === todoId);
      if (todo) {
        const priorities: ['low', 'medium', 'high'] = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(todo.priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
        Vue.set(todo, 'priority', nextPriority);
      }
    }
  }

  deleteTodo(listId: number, todoId: number) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      list.todos = list.todos.filter(t => t.id !== todoId);
    }
  }

  deleteList(listId: number) {
    this.lists = this.lists.filter(l => l.id !== listId);
  }
}
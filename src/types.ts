export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  isRemoving: boolean;
  isCompleting: boolean;
  deletedAt?: string;
}

export interface TextItem {
  id: number;
  text: string;
  isRemoving: boolean;
}

export interface RecurringSchedule {
  enabled: boolean;
  time: string; // 24-hour format "HH:mm"
}

export interface TodoList {
  id: number;
  name: string;
  type: 'tasks' | 'text';
  todos: Todo[];
  textItems: TextItem[];
  deletedTodos: Todo[];
  deletedTextItems: TextItem[];
  createdAt: string;
  recurringSchedule?: RecurringSchedule;
}
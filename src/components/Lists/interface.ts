export interface TodoLists {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface Todo {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
  userId: number;
}

export interface EditTodo {
  id: number;
  title: string;
  desc: string;
}

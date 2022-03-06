import { TodoState } from './state';

export function fetchTodoListDataSuccess(data: TodoState[]) {
  return {
    type: '@@Todo/FETCH_SUCCESS' as const,
    data,
  };
}

export type ITodoAction = ReturnType<typeof fetchTodoListDataSuccess>;

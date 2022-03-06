import { Dispatch } from 'redux';
import { fetchGetTodoList } from '../../api/todo';
import { fetchTodoListDataSuccess, ITodoAction } from './action';

export function getTodoListThunk() {
  return async (dispatch: Dispatch<ITodoAction>) => {
    const resp = await fetchGetTodoList();

    if (resp.status === 200) {
      const data = await resp.json();
      dispatch(fetchTodoListDataSuccess(data.todoList));
    }
  };
}

import produce from 'immer';
import { ITodoAction } from './action';
import { ITodoState } from './state';

const initialState: ITodoState = {
  todoList: [
    {
      id: 1,
      itemName: '訂花',
      dueDate: new Date(2022, 2, 20),
      remarks: '帶$500',
      isCompleted: false,
    },
    {
      id: 2,
      itemName: '試西裝',
      dueDate: new Date(2022, 3, 12),
      remarks: '32吋腰',
      isCompleted: false,
    },
    {
      id: 3,
      itemName: '買戒指',
      dueDate: new Date(2022, 4, 5),
      remarks: '20克',
      isCompleted: true,
    },
  ],
};

export const todoReducers = produce(
  (state: ITodoState, action: ITodoAction) => {
    switch (action.type) {
      case '@@Todo/FETCH_SUCCESS':
        state.todoList = action.data;
        return;

      default:
        return state;
    }
  },
  initialState
);

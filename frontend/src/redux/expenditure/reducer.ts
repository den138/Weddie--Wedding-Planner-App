import produce from 'immer';
import { IExpenditureAction } from './action';
import { IExpenditureState } from './state';

const initialState: IExpenditureState = {
  expenditureList: [
    {
      id: 1,
      category: '其他',
      amount: 2000,
      description: 'hello',
    },
    {
      id: 2,
      category: '美容',
      amount: 3000,
      description: 'hello',
    },
    {
      id: 3,
      category: '攝影',
      amount: 5000,
      description: 'hello',
    },
  ],
};

export const expenditureReducers = produce(
  (state: IExpenditureState, action: IExpenditureAction) => {
    switch (action.type) {
      case '@@Expenditure/FETCH_SUCCESS':
        state.expenditureList = action.data;
        return;

      default:
        return state;
    }
  },
  initialState
);

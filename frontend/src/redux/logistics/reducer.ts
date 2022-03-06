import produce from 'immer';
import { ILogisticsAction } from './action';
import { ILogisticsState } from './state';

const initialState: ILogisticsState = {
  materialList: [
    {
      id: 1,
      itemName: '花球',
      remarks: '電話 61728374',
    },
    { id: 2, itemName: '大襟姐', remarks: 'ling姐' },
    { id: 3, itemName: '婚攝' },
  ],
};

export const logisticReducers = produce(
  (state: ILogisticsState, action: ILogisticsAction) => {
    switch (action.type) {
      case '@@Logistics/FETCH_SUCCESS':
        state.materialList = action.data;
        return;

      default:
        return state;
    }
  },
  initialState
);

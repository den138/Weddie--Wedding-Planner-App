import produce from 'immer';
import { IGuestAction } from './action';
import { IGuestState } from './state';

const initialState: IGuestState = {
  guestList: [
    {
      id: 1,
      name: 'Matthew',
      phoneNumber: 54147689,
      relationship: '新娘弟弟中學同學',
    },
    {
      id: 2,
      name: 'Billy',
      phoneNumber: 62351429,
      relationship: '新娘弟弟男朋友',
    },
    {
      id: 3,
      name: 'Dennis',
      phoneNumber: 98146582,
      relationship: '新娘弟弟朋友',
    },
  ],
};

export const guestReducers = produce(
  (state: IGuestState, action: IGuestAction) => {
    switch (action.type) {
      case '@@Guest/FETCH_SUCCESS':
        state.guestList = action.data;
        return;

      default:
        return state;
    }
  },
  initialState
);

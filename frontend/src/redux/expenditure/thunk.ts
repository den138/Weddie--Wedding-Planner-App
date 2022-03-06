import { Dispatch } from 'redux';
import { fetchGetExpenditureList } from '../../api/expenditure';
import { fetchDataSuccess, IExpenditureAction } from './action';

export function getExpenditureListThunk() {
  return async (dispatch: Dispatch<IExpenditureAction>) => {
    const resp = await fetchGetExpenditureList();

    if (resp.status === 200) {
      const data = await resp.json();
      dispatch(fetchDataSuccess(data.expenditureList));
    }
  };
}

import { Dispatch } from 'redux';
import { fetchGetLogisticsList } from '../../api/logistics';
import { fetchDataSuccess, ILogisticsAction } from './action';

export function getAllMaterialItemsThunk() {
  return async (dispatch: Dispatch<ILogisticsAction>) => {
    const resp = await fetchGetLogisticsList();

    if (resp.status === 200) {
      const data = await resp.json();
      dispatch(fetchDataSuccess(data.logisticsList));
    }
  };
}

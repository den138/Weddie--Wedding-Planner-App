import { Dispatch } from 'redux';
import { fetchGetGuestList } from '../../api/guest';
import { fetchGuestDataSuccess, IGuestAction } from './action';

export function getGuestListThunk() {
  return async (dispatch: Dispatch<IGuestAction>) => {
    const resp = await fetchGetGuestList();

    if (resp.status === 200) {
      const data = await resp.json();
      dispatch(fetchGuestDataSuccess(data.guestList));
    }
  };
}

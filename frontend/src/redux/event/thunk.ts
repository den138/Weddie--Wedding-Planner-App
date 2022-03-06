import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchLogin, fetchRegister, fetchUser } from '../../api/auth';
import { fetchCreateEvent, fetchEventByEventId, fetchEventByUserId } from '../../api/event';
import { IRootState } from '../store';
import {
  createEventFailed,
  createEventSuccess,
  getEventFailed,
  getEventSuccess,
} from './actions';
import { ICreateEvent } from './state';

export function createEventThunk(event: ICreateEvent) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const resp = await fetchCreateEvent(event);
      const result = await resp.json();

      if (resp.status !== 200) {
        return dispatch(createEventFailed(result.error));
      }

      dispatch(createEventSuccess(result));
    } catch (e) {
      console.error(e);
      dispatch(createEventFailed('Unknown Error'));
    }
  };
}

export function restoreEventThunk() {
  return async (dispatch: Dispatch<any>, getState: () => IRootState) => {
    try {
      const userId = getState().auth.user?.id;

      console.log(userId);

      if (!userId) {
        return dispatch(getEventFailed('No event'));
      }

      const resp = await fetchEventByUserId(userId);
      const result = await resp.json();

      console.log(result);

      if (resp.status !== 200) {
        return dispatch(getEventFailed(result.error));
      }

      if (!result.id) {
        return dispatch(getEventFailed('No event'));
      }

      dispatch(getEventSuccess(result));
    } catch (e) {
      console.error(e);
      dispatch(getEventFailed('Unknown Error'));
    }
  };
}

export function chooseEventThunk(eventId: string){
  return async (dispatch: Dispatch<any>, getState: () => IRootState) => {
    try{
      const userId = getState().auth.user!.id;

      const resp = await fetchEventByEventId(parseInt(eventId), userId);
      
      const result = await resp.json();

      console.log(result);

      if (resp.status !== 200) {
        return dispatch(getEventFailed(result.error));
      }

      if (!result.id) {
        return dispatch(getEventFailed('No event'));
      }

      dispatch(getEventSuccess(result));

    } catch (e) {
      console.error(e);
      dispatch(getEventFailed('Unknown Error'));
    }
  }
}



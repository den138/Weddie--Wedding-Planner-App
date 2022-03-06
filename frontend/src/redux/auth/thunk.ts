import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import { fetchLogin, fetchUser } from '../../api/auth';
import { resetEvent } from '../event/actions';
import { restoreEventThunk } from '../event/thunk';
import { loginFailed, loginSuccess, logout } from './actions';

export function loginThunk(email: string, password: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const resp = await fetchLogin(email, password);
      const result = await resp.json();

      if (resp.status !== 200) {
        return dispatch(loginFailed(result.msg));
      }

      if (!result.token) {
        return dispatch(loginFailed('No Token'));
      }

      await AsyncStorage.setItem('token', result.token);
      dispatch(loginSuccess(result.token, result.userData));

      dispatch(restoreEventThunk());
    } catch (e) {
      console.error(e);
      dispatch(loginFailed('Unknown Error'));
    }
  };
}

export function restoreLoginThunk() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token == null) {
        dispatch(logout());
        return;
      }
      const resp = await fetchUser(token);
      const result = await resp.json();

      console.log(result);

      if (!result.userData) {
        return dispatch(logout());
      }

      if (!result.userData.id) {
        return dispatch(logout());
      }

      dispatch(loginSuccess(token, result.userData));

      dispatch(restoreEventThunk());
    } catch (e) {
      console.error(e);
      dispatch(logout());
    }
  };
}

export function signUpThunk() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token == null) {
        dispatch(logout());
        return;
      }
      const resp = await fetchUser(token);
      const result = await resp.json();

      console.log(result);

      if (!result.userData) {
        return dispatch(logout());
      }

      if (!result.userData.id) {
        return dispatch(logout());
      }

      dispatch(loginSuccess(token, result.userData));

      dispatch(restoreEventThunk());
    } catch (e) {
      console.error(e);
      dispatch(logout());
    }
  };
}

export function logoutThunk() {
  return async (dispatch: Dispatch<any>) => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
    dispatch(resetEvent());
  };
}

// export function signupThunk(signupUser: ISignupUser) {
//     return async (dispatch: Dispatch<any>) => {
//         try {
//             const resp = await fetchRegister(signupUser);
//             const result = await resp.json();

//             if (resp.status !== 200) {
//                 return dispatch(registerFailed(result.error))
//             }

//             if (!result.token) {
//                 return dispatch(registerFailed('No Token'))
//             }

//             await AsyncStorage.setItem('token', result.token);
//             dispatch(registerSuccess(result.token, result.user));

//         } catch (e) {
//             console.error(e)
//             dispatch(registerFailed('Unknown Error'))
//         }

//     }
// }

import { IAuthAction } from './actions';
import { IAuthState } from './state';

const initialState: IAuthState = {
  isAuthenticated: null,
  token: null,
  user: null,
  message: null,
};

export const authReducers = (state: IAuthState = initialState, action: IAuthAction): IAuthState => {
    switch (action.type) {
        case "@@auth/LOGIN_SUCCESS":
            return {
                isAuthenticated: true,
                token: action.token,
                user: action.user,
                message: null,
            }
        case "@@auth/LOGIN_FAILED":
            return {
                isAuthenticated: false,
                token: null,
                user: null,
                message: action.message,
            }
        case "@@auth/LOGOUT":
            return {
                isAuthenticated: false,
                token: null,
                user: null,
                message: null,
            }
        default:
            return state
    }
}

import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { IAuthAction } from './auth/actions';
import { authReducers } from './auth/reducers';
import { IAuthState } from './auth/state';
import { IEventAction } from './event/actions';
import { eventReducers } from './event/reducers';
import { IEventState } from './event/state';
import { IExpenditureAction } from './expenditure/action';
import { expenditureReducers } from './expenditure/reducer';
import { IExpenditureState } from './expenditure/state';
import { IGuestAction } from './guest/action';
import { guestReducers } from './guest/reducer';
import { IGuestState } from './guest/state';
import { ILogisticsAction } from './logistics/action';
import { logisticReducers } from './logistics/reducer';
import { ILogisticsState } from './logistics/state';
import { ITodoAction } from './todo/action';
import { todoReducers } from './todo/reducer';
import { ITodoState } from './todo/state';

// 1. Combining State by Composition
export interface IRootState {
  auth: IAuthState;
  event: IEventState;
  logistics: ILogisticsState;
  expenditure: IExpenditureState;
  guest: IGuestState;
  todo: ITodoState;
}

type IRootAction =
  | IAuthAction
  | IEventAction
  | ILogisticsAction
  | IExpenditureAction
  | IGuestAction
  | ITodoAction;

// 3. Combining Reducers by the function combineReducer()
const rootReducer = combineReducers<IRootState>({
  auth: authReducers,
  event: eventReducers,
  logistics: logisticReducers,
  expenditure: expenditureReducers,
  guest: guestReducers,
  todo: todoReducers,
});

// why cannot find global?

// @ts-ignore
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<IRootState, IRootAction, {}, {}>(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

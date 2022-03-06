import { ExpenditureState } from './state';

export function fetchDataSuccess(data: ExpenditureState[]) {
  return {
    type: '@@Expenditure/FETCH_SUCCESS' as const,
    data,
  };
}

export type IExpenditureAction = ReturnType<typeof fetchDataSuccess>;

import { LogisticsState } from './state';

export function fetchDataSuccess(data: LogisticsState[]) {
  return {
    type: '@@Logistics/FETCH_SUCCESS' as const,
    data,
  };
}

export type ILogisticsAction = ReturnType<typeof fetchDataSuccess>;

import { GuestState } from './state';

export function fetchGuestDataSuccess(data: GuestState[]) {
  return {
    type: '@@Guest/FETCH_SUCCESS' as const,
    data,
  };
}

export type IGuestAction = ReturnType<typeof fetchGuestDataSuccess>;

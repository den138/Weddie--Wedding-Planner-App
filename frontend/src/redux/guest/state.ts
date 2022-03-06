export interface GuestState {
  id: number;
  name: string;
  phoneNumber: number;
  relationship: string;
}

export interface IGuestState {
  guestList: GuestState[];
}

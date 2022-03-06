export interface ICreateEvent {
  eventName: string;
  bigday: Date;
  budget: string;
  pax: string;
  user_id: number;
  role: string;
  id: number;
  wedding_event_id: number;
}

export interface IEventState {
  event: ICreateEvent | null;
  isCreated: boolean | null;
  message: string | null;
}

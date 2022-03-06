import { config, displayName } from '../../app.json';
import { ISignupUser } from '../redux/auth/state';
import { ICreateEvent } from '../redux/event/state';

export const fetchCreateEvent = async (event: ICreateEvent) => {
  const resp = await fetch(`${config.BACKEND_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  return resp;
};

export const fetchEventByUserId = async (userId: number) => {
  const resp = await fetch(`${config.BACKEND_URL}/api/events/id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  return resp;
};

export const fetchEventByEventId = async (eventId: number, userId: number) => {
  const resp = await fetch(`${config.BACKEND_URL}/api/events/${userId}/${eventId}`)

  return resp;
}

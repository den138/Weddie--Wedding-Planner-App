import { config } from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Participant {
  wedding_event_id: number;
  name: string;
  phone: string;
  role_id: number;
}

export const fetchAddParti = async (partiData: Participant) => {
  try {
    console.log('parti data: ', partiData);

    const resp = await fetch(`${config.BACKEND_URL}/api/parti`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partiData),
    });

    const result = await resp.json();

    if (resp.status !== 200) {
      console.log('failed');
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchUpdateParti = async (partiData: Participant) => {
  try {
    console.log('parti data: ', partiData);

    const resp = await fetch(`${config.BACKEND_URL}/api/parti`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partiData),
    });

    const result = await resp.json();

    if (resp.status !== 200) {
      console.log('failed');
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchRemoveParti = async (partiId: number) => {
  try {
    console.log('partiId: ', partiId);

    const resp = await fetch(`${config.BACKEND_URL}/api/parti/${partiId}`, {
      method: 'DELETE',
    });

    const result = await resp.json();

    if (resp.status !== 200) {
      console.log('failed');
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

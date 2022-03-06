import { config } from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAddMessage = async (messageData: any) => {
  try {
    const eventId = messageData.wedding_event_id;

    const resp = await fetch(`${config.BACKEND_URL}/api/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    const result = await resp.json();

    if (resp.status !== 200) {
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

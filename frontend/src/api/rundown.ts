import { config } from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchRundownList() {
  const resp = await fetch(`${config.BACKEND_URL}/api/itin/list`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
    },
  });

  return resp;
}

export const fetchAddRundown = async (rundownData: any) => {
  try {
    console.log('rundown: ', rundownData);

    const resp = await fetch(`${config.BACKEND_URL}/api/itin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rundownData),
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

export const fetchUpdateRundown = async (rundownData: any) => {
  try {
    console.log('rundown data: ', rundownData);

    const resp = await fetch(`${config.BACKEND_URL}/api/itin/${rundownData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rundownData),
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

export const fetchRemoveRundown = async (rundownId: number) => {
  try {
    console.log('rundownId: ', rundownId);

    const resp = await fetch(`${config.BACKEND_URL}/api/itin/${rundownId}`, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
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

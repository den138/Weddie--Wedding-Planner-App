import { config } from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchGetTodoList() {
  const resp = await fetch(`${config.BACKEND_URL}/todo/list`, {
    headers: {
      Authorization: `Bearer ${AsyncStorage.getItem('token')}`,
    },
  });

  return resp;
}

export const fetchAddTodoItem = async (todoItemData: any) => {
  try {
    const resp = await fetch(`${config.BACKEND_URL}/api/todo/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoItemData),
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

export const fetchUpdateTodoItem = async (todoItemData: any) => {
  try {
    const resp = await fetch(`${config.BACKEND_URL}/api/todo/item`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoItemData),
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

export const fetchDeleteTodoItem = async (itemId: number) => {
  try {
    console.log('item id: ', itemId);

    const resp = await fetch(`${config.BACKEND_URL}/api/todo/item/${itemId}`, {
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

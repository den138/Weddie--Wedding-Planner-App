import { config } from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchAddExpenditureItem(expenditureItemData: any) {
  try {
    const resp = await fetch(`${config.BACKEND_URL}/api/budget/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenditureItemData),
    });
    const result = await resp.json();
    if (resp.status !== 200) {
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
}

export const fetchUpdateBudgetItem = async (expenditureItemData: any) => {
  try {

    const resp = await fetch(`${config.BACKEND_URL}/api/budget/item`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenditureItemData),
    });

    const result = await resp.json();

    if (resp.status !== 200) {
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchDeleteBudgetItem = async (data: {
  itemId: number;
  deleteTime: number;
}) => {
  try {
    const { itemId, deleteTime } = data;

    const resp = await fetch(
      `${config.BACKEND_URL}/api/budget/item/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteTime }),
      }
    );

    const result = await resp.json();

    if (resp.status !== 200) {
      throw new Error(result.message);
    }
  } catch (e) {
    throw e;
  }
};

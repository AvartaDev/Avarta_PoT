import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALL_WALLET_KEY,
  ETH_WALLET_KEY,
  LATEST_EXTERNAL_DATABASE_REF_ID,
} from '@constants/keys';

export const getAllWallets = async () => {
  try {
    const wallets = await getItem(ALL_WALLET_KEY);
    if (!wallets) {
      AsyncStorage.setItem(ALL_WALLET_KEY, {});
      return {};
    }
    return wallets;
  } catch (e) {
    console.log(e);
  }
};

export const getLatestExternalDatabaseRefID = async () => {
  const obj = await getItem(LATEST_EXTERNAL_DATABASE_REF_ID);
  const {value} = obj;
  console.log(`got refID is ${value}`);

  return value;
};

export const setLatestExternalDatabaseRefID = async value => {
  await setItem(LATEST_EXTERNAL_DATABASE_REF_ID, {value});
  console.log(`saved ${{value}}`)
  return await getLatestExternalDatabaseRefID();
};

export const deleteLatestExternalDatabaseRefID = async () => {
 await deleteItem(LATEST_EXTERNAL_DATABASE_REF_ID);
}


export const storeWallet = async (key, wallet) => {
  try {
    const existingWallets = await getAllWallets();
    existingWallets[key] = wallet;
    await setItem(ALL_WALLET_KEY, existingWallets);
  } catch (e) {
    console.log(e);
  }
};

const setItem = async (key, object) => {
  await AsyncStorage.setItem(key, JSON.stringify(object));
};

const getItem = async key => {
  const res = await AsyncStorage.getItem(key);
  return JSON.parse(res);
};

const deleteItem = async key => {
  await AsyncStorage.removeItem(key);
};

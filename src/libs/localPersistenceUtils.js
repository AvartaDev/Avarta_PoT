import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MASTER_WALLET_KEY,
  LATEST_EXTERNAL_DATABASE_REF_ID,
} from '@constants/keys';

export const getMasterWallet = async () => {
  try {
    const wallets = await getItem(MASTER_WALLET_KEY);
    if (!wallets) {
      AsyncStorage.setItem(MASTER_WALLET_KEY, {});
      return {};
    }
    return wallets;
  } catch (e) {
    console.log(e);
  }
};

export const storeTokenWallet = async (key, wallet) => {
  try {
    const masterWallet = await getMasterWallet();
    const tokenWallets = masterWallet[key] ? masterWallet[key] : []
    tokenWallets.push(wallet)
    masterWallet[key] = tokenWallets;
    await setItem(MASTER_WALLET_KEY, masterWallet);
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

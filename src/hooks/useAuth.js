import React from 'react';
import {attachLoader, addHexPrefix} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/AuthStore';
import {useWallet} from '@hooks/useWallet';
import {captureException} from '@sentry/react-native';
import {AVARTA_MASTER_KEY} from '@env';
import {ACCESSIBLE, getSupportedBiometryType} from 'react-native-keychain';
import AesEncryptor from '@libs/aesEncryption';
import * as keychain from '@libs/keychain';
import {
  pinKey,
  addressKey,
  privateKeyKey,
  seedPhraseKey,
} from '@libs/keychainConstants';

import {Linking, NativeModules, Alert, Platform} from 'react-native';
import {generateMnemonic} from '../libs/bip39/index';
import axios from 'axios';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';
export const publicAccessControlOptions = {
  accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
};

export const useAuth = () => {
  const {deriveAccountFromMnemonic, setSolanaWallet} = useWallet();
  const encryptor = new AesEncryptor();
  const {RNBip39} = NativeModules;
  const [loading, setLoading] = React.useState({});

  const activate = attachLoader(setLoading);

  const store = useStore();

  const dispatch = useDispatch();

  const getExistingPassword = async () => {
    try {
      const encryptedPassword = await keychain.loadString(pinKey);
      // The user has a Password already, we need to decrypt it
      if (encryptedPassword) {
        const userPassword = await encryptor.decrypt(
          AVARTA_MASTER_KEY,
          encryptedPassword,
        );
        console.log(userPassword);
        return userPassword;
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return null;
  };
  const loginUser = activate('login', async password => {
    const oldPwd = await getExistingPassword();
    if (oldPwd && oldPwd !== password) {
      Alert.alert(
        'Wrong Password',
        'You have entered a wrong password, please try again.',
        [{text: 'OK', onPress: () => {}}],
      );
      return;
    }
    try {
      const wallet = await encryptor.decrypt(password, privateKeyKey);
      dispatch({type: actions.LOGIN_SUCCESS, payload: true});
    } catch (e) {
      dispatch({type: actions.LOGIN_FAILED, payload: null});
    }
  });

  const savePassword = async password => {
    try {
      const encryptedPassword = await encryptor.encrypt(
        AVARTA_MASTER_KEY,
        password,
      );
      if (encryptedPassword) {
        await keychain.saveString(pinKey, encryptedPassword);
      }
    } catch (e) {
      console.log('Error saving pin');
      captureException(e);
    }
  };
  const saveAddress = async (
    address,
    accessControlOptions = publicAccessControlOptions,
  ) => {
    return keychain.saveString(addressKey, address, accessControlOptions);
  };

  const saveSeedPhrase = async (seedphrase, keychain_id) => {
    const privateAccessControlOptions =
      await keychain.getPrivateAccessControlOptions();
    const key = `${keychain_id}_${seedPhraseKey}`;
    const val = {
      id: keychain_id,
      seedphrase,
    };

    return keychain.saveObject(key, val, privateAccessControlOptions);
  };
  const savePrivateKey = async (address, privateKey) => {
    const privateAccessControlOptions =
      await keychain.getPrivateAccessControlOptions();

    const key = `${address}_${privateKeyKey}`;
    const val = {
      address,
      privateKey,
    };

    await keychain.saveObject(key, val, privateAccessControlOptions);
    console.log('saved pk');
  };

  const getPrivateKey = async address => {
    try {
      const key = `${address}_${privateKeyKey}`;
      const pkey = await keychain.loadObject(key);

      if (pkey === -2) {
        Alert.alert('Error', 'Authentication method not secure');
        return null;
      }

      return pkey || null;
    } catch (error) {
      console.log('Error in getPrivateKey');
      captureException(error);
      return null;
    }
  };

  const getSeedPhrase = async address => {
    try {
      const key = `${address}_${seedPhraseKey}`;
      const seedPhraseData = await keychain.loadObject(key);

      if (seedPhraseData === -2) {
        Alert.alert('Error', 'Authentication method not secure');
        return null;
      }

      return seedPhraseData || null;
    } catch (error) {
      console.log('Error in getSeedPhrase');
      captureException(error);
      return null;
    }
  };

  const createWallet = async (seed = null, userPassword) => {
    console.log('Creating Wallet');
    if (!seed) {
      console.log('Generating new seed phrase');
    }
    const walletSeed = await generateMnemonic();
    console.log(walletSeed, 'wallet seed');

    const newWallet = await deriveAccountFromMnemonic(walletSeed);

    console.log(newWallet, 'new wallet');
    let pKey = walletSeed;
    if (!newWallet.wallet) return null;
    const walletAddress = newWallet.address;

    if (newWallet.isHDWallet) {
      pKey = addHexPrefix(newWallet.wallet.getPrivateKey().toString('hex'));
    }
    // encrypt wallet seed with password
    const encryptedSeed = await encryptor.encrypt(userPassword, walletSeed);

    await saveSeedPhrase(encryptedSeed, walletAddress);

    await saveAddress(walletAddress);

    //encrypt privatekey with password
    const encryptedPrivateKey = await encryptor.encrypt(userPassword, pKey);

    //save encrypted private key
    await savePrivateKey(walletAddress, encryptedPrivateKey);

    dispatch({type: actions.CREATE_WALLET, payload: newWallet});

    const res = await axios.post(
      'https://avarta-api.herokuapp.com/api/create?network=solana',
    );
    const {data} = res;
    await setSolanaWallet(data);
    dispatch({type: actions.CREATE_SOLANA_WALLET, payload: data});
  };

  return {
    setPassword: store.setPassword,
    loading: loading,
    savePassword,
    saveAddress,
    loginUser,
    createWallet,
    solWallet: store.solWallet,
    wallet: store.wallet,
  };
};

export default useAuth;

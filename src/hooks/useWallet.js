import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
import {useStore as useAuthStore} from '../store/AuthStore';
import axios from 'axios';
import {Wallet} from '@ethersproject/wallet';
import Buffer from 'buffer';
import {addHexPrefix, isValidAddress, toChecksumAddress} from 'ethereumjs-util';
import {Linking, NativeModules, Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import {JsonRpcProvider} from '@ethersproject/providers';
import {mnemonicToSeed} from '../libs/bip39/index';
import Solus from 'rnsolus';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

const SERVER_BASE_URL = 'https://platform.solusconnect.com/';
const ORGANISATION_KEY = 'A5014D70-7956-478E-9680-C9B6CEA67689';

const DeviceKeyIdentifier = 'dr33yhXwWE7gnyZaBxraLtZppdaArzFG';
const FaceScanEncryptionKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
  'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
  'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
  'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
  'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
  'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
  '8QIDAQAB\n' +
  '-----END PUBLIC KEY-----';

export const useWallet = () => {
  const [loading, setLoading] = React.useState({});

  const BASE_URL = 'https://avarta-api.herokuapp.com/api/';

  const activate = attachLoader(setLoading);

  const store = useStore();
  const authStore = useAuthStore();
  const dispatch = useDispatch();

  const deriveAccountFromMnemonic = activate(
    'retrieveWallet',
    async (mnemonic, index = 0) => {
      let seed;
      if (Platform.OS == 'ios') {
        seed = await mnemonicToSeed(mnemonic);
      } else {
        // const res = await mnemonicToSeed({mnemonic, passphrase: null});
        seed = await mnemonicToSeed(mnemonic);
        // seed = new Buffer(res.data, 'base64');
      }
      console.log('before hd', seed);
      const hdWallet = hdkey.fromMasterSeed(seed);

      const root = hdWallet.derivePath(DEFAULT_HD_PATH);
      const child = root.deriveChild(index);
      const wallet = child.getWallet();
      const newWallet = {
        address: toChecksumAddress(`0x${wallet.getAddress().toString('hex')}`),
        isHDWallet: true,
        root,
        wallet,
        privateKey: wallet.privateKey.toString('hex'),
      };
      dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: newWallet});
      return newWallet;
    },
  );

  const deriveAccountFromPrivateKey = privateKey => {
    const ethersWallet = new Wallet(addHexPrefix(privateKey));
    const wallet = {
      address: ethersWallet.address,
      isHDWallet: false,
      root: null,
      wallet: ethersWallet,
    };

    dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: wallet});
  };
  const getWalletBalance = async (address, solanaAddress) => {
    let bscBalance, ethBalance;
    try {
      if (address) {
        bscBalance = await axios.get(
          `https://avarta-api.herokuapp.com/api/balance/${address}?network=bsc`,
        );
        ethBalance = await axios.get(
          `https://avarta-api.herokuapp.com/api/balance/${address}?network=eth`,
        );
      }
      let solBalance;
      if (solanaAddress) {
        solBalance = await axios.get(
          `https://avarta-api.herokuapp.com/api/balance/${solanaAddress}?network=solana`,
        );
      }
      const balanceData = {
        eth: ethBalance.data.amount,
        bsc: bscBalance.data.amount,
        solana: solBalance.data.amount,
      };
      dispatch({type: actions.SET_WALLET_BALANCE, payload: balanceData});
      return balanceData;
    } catch (err) {
      console.log(err);
    }
  };

  const sendFunds = async (address, amount, network, privateKey) => {
    try {
      Solus.onCreate(
        DeviceKeyIdentifier,
        FaceScanEncryptionKey,
        SERVER_BASE_URL,
        ORGANISATION_KEY,
      );
      const msg = await Solus.StepUpProcess(
        authStore.username,
        authStore.password,
      );
      if (!msg.toLowerCase().includes('completed')) {
        return;
      }

      const res = await axios.post(
        `https://avarta-api.herokuapp.com/api/transfer`,
        {
          privateKey: privateKey,
          // '0bab7eff841e2d8988b2b06f258deac1c29dd96a37310301d1177b8fc3559719',
          amount,
          receiver: address,
          network: network,
        },
      );
      console.log(
        'Address: ',
        store.usersWallet.address,
        store.solanaWallet.address,
      );
      await getWalletBalance(
        store.usersWallet.address,
        store.solanaWallet.address,
      );
      return res.data.hash;
    } catch (err) {
      console.log(err);
    }
  };
  const sendSolana = async (address, amount, privateKey) => {
    Solus.onCreate(
      DeviceKeyIdentifier,
      FaceScanEncryptionKey,
      SERVER_BASE_URL,
      ORGANISATION_KEY,
    );
    const msg = await Solus.StepUpProcess(
      authStore.username,
      authStore.password,
    );
    if (!msg.toLowerCase().includes('completed')) {
      return;
    }
    try {
      const res = await axios.post(
        `https://avarta-api.herokuapp.com/api/transfer`,
        {
          privateKey: privateKey,
          amount,
          receiver: address,
          network: 'solana',
        },
      );
      await getWalletBalance(
        store.usersWallet.address,
        store.solanaWallet.address,
      );
      return res.data.hash;
    } catch (err) {
      console.log(err);
    }
  };

  const setSolanaWallet = async wallet => {
    dispatch({type: actions.SET_SOLANA_WALLET, payload: wallet});
  };

  return {
    wallet: store.usersWallet,
    solanaWallet: store.solanaWallet,
    walletBalance: store.walletBalance,
    loading: loading,
    deriveAccountFromPrivateKey,
    deriveAccountFromMnemonic,
    getWalletBalance,
    sendFunds,
    sendSolana,
    setSolanaWallet,
  };
};

export default useWallet;

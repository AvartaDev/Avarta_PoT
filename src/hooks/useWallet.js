import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
import axios from 'axios';
import {Wallet} from '@ethersproject/wallet';
import Buffer from 'buffer';
import {addHexPrefix, isValidAddress, toChecksumAddress} from 'ethereumjs-util';
import {Linking, NativeModules, Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import {JsonRpcProvider} from '@ethersproject/providers';
import {mnemonicToSeed} from '../libs/bip39/index';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

export const useWallet = () => {
  const [loading, setLoading] = React.useState({});

  const BASE_URL = 'https://transaction-signer.herokuapp.com/api/';

  const PROVIDER_URL = 'https://bsc-dataseed.binance.org/';
  const network = {
    name: 'Binance',
    chainId: 97,
  };

  const activate = attachLoader(setLoading);

  const store = useStore();

  const dispatch = useDispatch();

  const deriveAccountFromMnemonic = activate(
    'retrieveWallet',
    async (mnemonic, index = 0) => {
      let seed;
      console.log('seed', seed);
      if (Platform.OS == 'ios') {
        seed = await mnemonicToSeed(mnemonic);
      } else {
        const res = await mnemonicToSeed({mnemonic, passphrase: null});
        seed = new Buffer(res, 'base64');
      }
      console.log('before hd');
      const hdWallet = hdkey.fromMasterSeed(seed);

      const root = hdWallet.derivePath(DEFAULT_HD_PATH);
      const child = root.deriveChild(index);
      const wallet = child.getWallet();
      const newWallet = {
        address: toChecksumAddress(`0x${wallet.getAddress().toString('hex')}`),
        isHDWallet: true,
        root,
        wallet,
      };
      dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: newWallet});
      return newWallet;
    },
  );

  const deriveAccountFromPrivateKey = privateKey => {
    const ethersWallet = new Wallet(addHexPrefix(privateKey));
    console.log(Wallet);
    const wallet = {
      address: ethersWallet.address,
      isHDWallet: false,
      root: null,
      wallet: ethersWallet,
    };

    dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: wallet});
  };
  const getWalletBalance = async address => {
    console.log(address);
    console.log(BASE_URL);
    const balance = await axios.get(
      `https://transaction-signer.herokuapp.com/api/balance/${address}?network=bsc`,
    );

    console.log('balance', balance.data);
    dispatch({type: actions.SET_WALLET_BALANCE, payload: balance.data.amount});
    return balance;
  };
  const sendFunds = async (address, amount) => {
    const res = await axios.post(
      `https://transaction-signer.herokuapp.com/api/transfer`,
      {
        privateKey:
          '20647979de367cb72e6e2619128cdd6cb9ed56a0ab7449adb460f08f5f817b3a',
        amount,
        receiver: address,
        network: 'bsc',
      },
    );
    console.log('res', res.data.hash);
    return res.data.hash;
  };

  return {
    wallet: store.usersWallet,
    walletBalance: store.walletBalance,
    loading: loading,
    deriveAccountFromPrivateKey,
    deriveAccountFromMnemonic,
    getWalletBalance,
    sendFunds,
  };
};

export default useWallet;

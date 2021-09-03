import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
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

  const PROVIDER_URL = 'https://bsc-dataseed.binance.org/';
  const network = {
    name: 'Binance',
    chainId: 97,
  };
  const web3Provider = new JsonRpcProvider(PROVIDER_URL, network);

  console.log('web3Provider', web3Provider);

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
    const balance = await web3Provider.getBalance(address);
    console.log('balance', balance);
    dispatch({type: actions.SET_WALLET_BALANCE, payload: balance});
    return balance;
  };

  return {
    wallet: store.usersWallet,
    walletBalance: store.walletBalance,
    loading: loading,
    deriveAccountFromPrivateKey,
    deriveAccountFromMnemonic,
    getWalletBalance,
  };
};

export default useWallet;

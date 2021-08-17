import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/AuthStore';
import {Wallet} from '@ethersproject/wallet';
import useWallet from '@hooks/useWallet';
import {mnemonicToSeed, generateMnemonic} from 'bip39';
import Buffer from 'buffer';
import {addHexPrefix, isValidAddress, toChecksumAddress} from 'ethereumjs-util';
import {Linking, NativeModules, Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

export const useAuth = () => {
  const {RNBip39} = NativeModules;
  const [loading, setLoading] = React.useState({});

  const activate = attachLoader(setLoading);

  const store = useStore();

  const dispatch = useDispatch();

  return {
    setPassword: store.setPassword,
    loading: loading,
  };
};

export default useAuth;

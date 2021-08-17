import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
import {Wallet} from '@ethersproject/wallet';
import {mnemonicToSeed, generateMnemonic} from 'bip39';
import Buffer from 'buffer';
import {addHexPrefix, isValidAddress, toChecksumAddress} from 'ethereumjs-util';
import {Linking, NativeModules, Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

export const useWallet = () => {
  const {RNBip39} = NativeModules;
  const [loading, setLoading] = React.useState({});

  const activate = attachLoader(setLoading);

  const store = useStore();

  const dispatch = useDispatch();

  const deriveAccountFromMnemonic = activate(
    'retrieveWallet',
    async (mnemonic, index = 0) => {
      let seed;
      if (Platform.OS == 'ios') {
        seed = await mnemonicToSeed(mnemonic);
      } else {
        const res = await RNBip39.mnemonicToSeed({mnemonic, passphrase: null});
        seed = new Buffer(res, 'base64');
      }
      const hdWallet = hdkey.fromMasterSeed(seed);
      const root = hdWallet.derivePath(DEFAULT_HD_PATH);
      const child = root.deriveChild(index);
      const wallet = child.getWallet();
      const newWallet = {
        address: toChecksumAddress(wallet.getAddress().toString('hex')),
        isHDWallet: true,
        root,
        wallet,
      };
      dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: newWallet});
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

  return {
    wallet: store.usersWallet,
    loading: loading,
    deriveAccountFromPrivateKey,
    deriveAccountFromMnemonic,
  };
};

export default useWallet;

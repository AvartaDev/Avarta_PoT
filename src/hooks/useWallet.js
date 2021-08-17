import React from 'react';
import {attachLoader} from '../libs/utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
import {Wallet} from '@ethersproject/wallet';

export const useWallet = () => {
  const [loading, setLoading] = React.useState({});

  const activate = attachLoader(setLoading);

  const store = useStore();

  const dispatch = useDispatch();

  const createWalletFromPrivateKey = activate('wallet', privateKey => {
    let walletPrivateKey = new Wallet(privateKey);
    dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: walletPrivateKey});
  });
  const createWalletFromMnemonic = activate('wallet', mnemonic => {
    let walletmnemonic = new Wallet(mnemonic);
    dispatch({type: actions.CREATE_WALLET_FROMKEY, payload: walletmnemonic});
  });

  const createWallet = activate('wallet', password => {
    let newWallet = Wallet.createRandom();
    console.log(newWallet);
    dispatch({
      type: actions.CREATE_WALLET,
      payload: newWallet,
    });
  });

  return {
    wallet: store.usersWallet,
    loading: loading,
    createWallet,
    createWalletFromPrivateKey,
    createWalletFromMnemonic,
  };
};

export default useWallet;

import React from 'react';
import {attachLoader} from './utils';
import {useStore, useDispatch, actions} from '../store/WalletStore';
import axios from 'axios';
import {Wallet} from '@ethersproject/wallet';
import Buffer from 'buffer';
import {addHexPrefix, isValidAddress, toChecksumAddress} from 'ethereumjs-util';
import {Linking, NativeModules, Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import {JsonRpcProvider} from '@ethersproject/providers';
import * as Bip39 from 'react-native-bip39';
import {mnemonicToSeed} from './bip39/index';
import {ETH_WALLET_KEY} from '@constants/keys';
import { getEthBalance } from './BlockchainUtils';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

export const deriveAccountFromMnemonic = async (mnemonic, index = 0) => {
  //console.log(mnemonic)
  let seed;
  if (Platform.OS == 'ios') {
    seed = await mnemonicToSeed(mnemonic);
  } else {
    //console.log("ASD")
    const res = await Bip39.mnemonicToSeed(mnemonic, null);
    //console.log(res)
    seed = res.toString('base64');
    //console.log(seed)
  }

  const hdWallet = hdkey.fromMasterSeed(seed);

  const root = hdWallet.derivePath(DEFAULT_HD_PATH);
  const publicExtendedKey = root.publicExtendedKey().toString('base64');
  const privateExtendedKey = root.privateExtendedKey().toString('base64');
  const wallet = root.getWallet();
  const walletPub = wallet.getPublicKeyString();
  const walletPrv = wallet.getPrivateKeyString();
  const address = toChecksumAddress(`0x${wallet.getAddress().toString('hex')}`);
  const res = {
    address,
    isHDWallet: true,
    root,
    wallet,
    publicExtendedKey,
    privateExtendedKey,
    walletPub,
    walletPrv,
  };
  //console.log("deriveAccountFromMnemonic DONE", res)
  return res;
};

export const getWalletBalance = async (address, token) => {
  switch (token) {
    case ETH_WALLET_KEY:
      console.log("fetching ETH")
      return getEthBalance(address)
    default:
      break;
  }
};

// export const useWallet = () => {

//   const BASE_URL = 'https://transaction-signer.herokuapp.com/api/';

//   const activate = attachLoader(setLoading);

//   const store = useStore();

//   const dispatch = useDispatch();

//   const deriveAccountFromMnemonic = activate(
//     'retrieveWallet',
//     async (mnemonic, index = 0) => {
//       let seed;
//       //console.log('seed', seed);
//       if (Platform.OS == 'ios') {
//         seed = await mnemonicToSeed(mnemonic);
//       } else {
//         const res = await mnemonicToSeed({ mnemonic, passphrase: null });
//         seed = new Buffer(res, 'base64');
//       }
//       //console.log('before hd');
//       const hdWallet = hdkey.fromMasterSeed(seed);

//       const root = hdWallet.derivePath(DEFAULT_HD_PATH);
//       const child = root.deriveChild(index);
//       const wallet = child.getWallet();
//       const newWallet = {
//         address: toChecksumAddress(`0x${wallet.getAddress().toString('hex')}`),
//         isHDWallet: true,
//         root,
//         wallet,
//       };
//       dispatch({ type: actions.CREATE_WALLET_FROMKEY, payload: newWallet });
//       return newWallet;
//     },
//   );

//   const deriveAccountFromPrivateKey = privateKey => {
//     const ethersWallet = new Wallet(addHexPrefix(privateKey));
//     //console.log(Wallet);
//     const wallet = {
//       address: ethersWallet.address,
//       isHDWallet: false,
//       root: null,
//       wallet: ethersWallet,
//     };

//     dispatch({ type: actions.CREATE_WALLET_FROMKEY, payload: wallet });
//   };
//   const getWalletBalance = async (address, solanaAddress) => {
//     //console.log(address);
//     let balance;
//     if (address) {
//       balance = await axios.get(
//         `https://transaction-signer.herokuapp.com/api/balance/${address}?network=bsc`,
//       );
//     }
//     let solBalance;
//     if (solanaAddress) {
//       solBalance = await axios.get(
//         `https://transaction-signer.herokuapp.com/api/balance/${solanaAddress}?network=solana`,
//       );
//     }
//     //console.log('balance', balance.data);
//     const balanceData = {
//       bsc: balance.data.amount,
//       solana: solBalance.data.amount,
//     };
//     dispatch({ type: actions.SET_WALLET_BALANCE, payload: balanceData });
//     return balance;
//   };
//   const sendFunds = async (address, amount) => {
//     const res = await axios.post(
//       `https://transaction-signer.herokuapp.com/api/transfer`,
//       {
//         privateKey:
//           '0bab7eff841e2d8988b2b06f258deac1c29dd96a37310301d1177b8fc3559719',
//         amount,
//         receiver: address,
//         network: 'bsc',
//       },
//     );
//     //console.log('res', res.data.hash);
//     return res.data.hash;
//   };
//   const sendSolana = async (address, amount, privateKey) => {
//     const res = await axios.post(
//       `https://transaction-signer.herokuapp.com/api/transfer`,
//       {
//         privateKey: privateKey,
//         amount,
//         receiver: address,
//         network: 'solana',
//       },
//     );
//     //console.log('res', res.data.hash);
//     return res.data.hash;
//   };

//   return {
//     wallet: store.usersWallet,
//     walletBalance: store.walletBalance,
//     loading: loading,
//     deriveAccountFromPrivateKey,
//     deriveAccountFromMnemonic,
//     getWalletBalance,
//     sendFunds,
//     sendSolana,
//   };
// };

// export default useWallet;

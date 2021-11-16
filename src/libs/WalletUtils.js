import {toChecksumAddress} from 'ethereumjs-util';
import {Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import * as Bip39 from 'react-native-bip39';
import {mnemonicToSeed} from './bip39/index';
import {BSC_WALLET_KEY, ETH_WALLET_KEY} from '@constants/keys';
import {
  getBscBalance,
  getEthBalance,
  sendBsc,
  sendEth,
} from './BlockchainUtils';
import Toast from 'react-native-toast-message';

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

export const deriveAccountFromMnemonic = async (mnemonic, index = 0) => {
  let seed;
  if (Platform.OS == 'ios') {
    seed = await mnemonicToSeed(mnemonic);
  } else {
    const res = await Bip39.mnemonicToSeed(mnemonic, null);
    seed = res.toString('base64');
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

const tokenGetterMap = {
  [ETH_WALLET_KEY]: getEthBalance,
  [BSC_WALLET_KEY]: getBscBalance,
};

export const getWalletBalance = async (address, token) => {
  console.log(`GETTING ${token} BALANCE`);
  return await tokenGetterMap[token](address);
};

const tokenTransferMap = {
  [ETH_WALLET_KEY]: sendEth,
  [BSC_WALLET_KEY]: sendBsc,
};

export const sendTokens = async (
  targetAddr,
  value,
  token,
  wallet,
  onTransactionHash,
) => {
  const currBalance = parseFloat(await getWalletBalance(wallet.address, token));
  const transferAmount = parseFloat(value);
  let res;
  if (value > currBalance) {
    Toast.show({
      type: 'error',
      text1: 'Insufficient amount',
      text2: 'Wallet lacks funds to perform transfer',
    });
    res = null;
  } else {
    console.log(
      `SENDING ${value} on ${token} to ${targetAddr}, balance: ${currBalance}`,
    );
    await tokenTransferMap[token](targetAddr, value, wallet, onTransactionHash);
    res = true;
  }

  return res;
};

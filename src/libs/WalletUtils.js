import {ETH_WALLET_KEY, BSC_WALLET_KEY, SOL_WALLET_KEY} from '@constants/keys';
import Toast from 'react-native-toast-message';
import binanceLibs from '@libs/tokenLibs/binanceLibs';
import solanaLibs from '@libs/tokenLibs/solanaLibs';
import ethereumLibs from '@libs/tokenLibs/ethereumLibs';

const tokenLibMap = {
  [ETH_WALLET_KEY]: ethereumLibs,
  [BSC_WALLET_KEY]: binanceLibs,
  [SOL_WALLET_KEY]: solanaLibs,
};

export const deriveAccountFromMnemonic = async (mnemonic, token) => {
  return await tokenLibMap[token].deriveAccountFromMnemonic(mnemonic);
};

export const getWalletBalance = async (address, token) => {
  return await tokenLibMap[token].getWalletBalance(address);
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
    await tokenLibMap[token].sendTokens(
      targetAddr,
      value,
      wallet,
      onTransactionHash,
    );
    res = true;
  }

  return res;
};

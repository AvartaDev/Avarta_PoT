import Web3 from 'web3';
import Common from '@ethereumjs/common';
import {toChecksumAddress} from 'ethereumjs-util';
import {Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import * as Bip39 from 'react-native-bip39';
import {mnemonicToSeed} from '@libs/bip39/index';
import {TokenNetworkMapping} from '@libs/networks';
import {Transaction} from '@ethereumjs/tx';
import {BSC_WALLET_KEY} from '@constants/keys';

const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;

const deriveAccountFromMnemonic = async (mnemonic, index = 0) => {
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
  return res;
};

const getWalletBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(TokenNetworkMapping[BSC_WALLET_KEY].rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

const sendTokens = async (target, value, wallet, onReceiveTxHash) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(TokenNetworkMapping[BSC_WALLET_KEY].rpcUrl),
  );

  const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');

  const txData = {
    from: wallet.address,
    to: target,
    value: web3.utils.toBN(web3.utils.toWei(value.toString(), 'ether')),
    nonce: `0x${nonce.toString(16)}`,
    gasLimit: web3.utils.toHex(700000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('21', 'gwei')),
  };

  const common = Common.forCustomChain(
    'mainnet',
    {
      name: 'bnb',
      networkId: 97,
      chainId: 97,
    },
    'petersburg',
  );

  const tx = Transaction.fromTxData(txData, {common});
  const signedTx = tx.sign(Buffer.from(wallet.walletPrv.substring(2), 'hex'));
  const serializedTx = signedTx.serialize();
  console.log('sending');
  web3.eth
    .sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .once('transactionHash', hash => onReceiveTxHash(hash));
  return true;
};

export default binanceLibs = {
  deriveAccountFromMnemonic,
  sendTokens,
  getWalletBalance,
};

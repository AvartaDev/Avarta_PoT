import {toChecksumAddress} from 'ethereumjs-util';
import {Platform} from 'react-native';
import {hdkey} from 'ethereumjs-wallet';
import * as Bip39 from 'react-native-bip39';
import {mnemonicToSeed} from '@libs/bip39/index';
import {ETH_WALLET_KEY} from '@constants/keys';
import Web3 from 'web3';
import NetworkList from '@libs/networks';

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
  //console.log("deriveAccountFromMnemonic DONE", res)
  return res;
};

export const getWalletBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(NetworkList.ropsten.rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

const sendTokens = async (target, value, wallet, onReceiveTxHash) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(TokenNetworkMapping[ETH_WALLET_KEY].rpcUrl),
  );
  web3.eth.defaultChain = 'ropsten';
  // nonce starts counting from 0
  console.log(`Target: ${target}, value: ${web3.utils.toWei(value, 'ether')}`);
  const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
  const gasLimit = 160000;
  let maxPriorityFeePerGas = web3.utils.toWei('21', 'gwei');
  console.log('wei', maxPriorityFeePerGas);
  maxPriorityFeePerGas = web3.utils.numberToHex(maxPriorityFeePerGas);

  let maxFeePerGas = web3.utils.toWei('21', 'gwei');
  console.log('wei', maxFeePerGas);
  maxFeePerGas = web3.utils.numberToHex(maxFeePerGas);
  const txData = {
    nonce: `0x${nonce.toString(16)}`,
    from: wallet.address,
    to: target,
    value: web3.utils.toBN(web3.utils.toWei(value.toString(), 'ether')), // // no fucking idea i copy one
    gasLimit: '0x' + gasLimit.toString(16),
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
  console.log(txData);

  const common = new Common({chain: Chain.Ropsten, hardfork: Hardfork.London});
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData, {common});
  console.log(tx);

  const signedTx = tx.sign(Buffer.from(wallet.walletPrv.substring(2), 'hex'));
  console.log(signedTx);

  const serializedTx = signedTx.serialize();
  web3.eth
    .sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .once('transactionHash', hash => onReceiveTxHash(hash));
  return true;
};

export default ethereumLibs = {
  deriveAccountFromMnemonic,
  sendTokens,
  getWalletBalance,
};

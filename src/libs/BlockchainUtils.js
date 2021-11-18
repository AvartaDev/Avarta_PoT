import Web3 from 'web3';
import {NetworkList, TokenNetworkMapping} from './networks';
import {FeeMarketEIP1559Transaction, Transaction} from '@ethereumjs/tx';
import Common, {Chain, Hardfork} from '@ethereumjs/common';
import {BSC_WALLET_KEY, ETH_WALLET_KEY} from '@constants/keys';

export const getEthBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(NetworkList.ropsten.rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

export const sendEth = async (target, value, wallet, onReceiveTxHash) => {
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

//TODO: abstract out duplicate code
export const getBscBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(TokenNetworkMapping[BSC_WALLET_KEY].rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

export const sendBsc = async (target, value, wallet, onReceiveTxHash) => {
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

  const common = Common.forCustomChain('mainnet', {
    name: 'bnb',
    networkId: 97,
    chainId: 97
  }, 'petersburg');

  const tx = Transaction.fromTxData(txData, {common});
  const signedTx = tx.sign(Buffer.from(wallet.walletPrv.substring(2), 'hex'));
  const serializedTx = signedTx.serialize();
  console.log('sending')
  web3.eth
    .sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .once('transactionHash', hash => onReceiveTxHash(hash));
  return true;

};

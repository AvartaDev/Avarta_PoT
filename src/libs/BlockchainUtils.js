import Web3 from 'web3';
import {NetworkList} from './networks';
import {FeeMarketEIP1559Transaction, Transaction} from '@ethereumjs/tx';
import Common, {Chain, Hardfork} from '@ethereumjs/common';
import {consoleSandbox} from '@sentry/utils';

export const getEthBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(NetworkList.ropsten.rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

export const sendEth = async (target, value, wallet) => {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(NetworkList.ropsten.rpcUrl),
  );
  web3.eth.defaultChain = 'ropsten';
  // nonce starts counting from 0
  console.log(`Target: ${target}, value: ${web3.utils.toWei(value, 'ether')}`);
  const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
  const gasLimit = 30000;
  const txData = {
    nonce: `0x${nonce.toString(16)}`,
    from: wallet.address,
    to: target,
    value: `0x${web3.utils.toWei(value, 'ether').toString(16)}`,
    // // no fucking idea i copy one
    gasLimit: '0x' + gasLimit.toString(16),
    maxPriorityFeePerGas: '0x01',
    maxFeePerGas: '0x01',
  };
  console.log(txData);
  const est = await web3.eth.estimateGas({
    nonce: `0x${nonce.toString(16)}`,
    from: wallet.address,
    to: target,
    value: `0x${web3.utils.toWei(value, 'ether').toString(16)}`,
  });

  console.log('est: ', est);
  const common = new Common({chain: Chain.Ropsten, hardfork: Hardfork.London});
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData, {common});
  console.log(tx);

  const signedTx = tx.sign(Buffer.from(wallet.walletPrv.substring(2), 'hex'));
  console.log(signedTx);

  const serializedTx = signedTx.serialize();
  const res = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), done => {
    console.log(done);
  });
  console.log(res);
  console.log('SENT ETH');
};

//TODO: abstract out duplicate code
export const getBscBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(NetworkList.BSC_TEST.rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei, 'ether');
  return eth;
};

export const sendBsc = async (target, value, wallet) => {
  console.log('SEND BSC');
};

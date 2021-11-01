import Web3 from 'web3';
import {NetworkList} from './networks';

export const getEthBalance = async address => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(NetworkList.ropsten.rpcUrl),
  );

  const wei = await web3.eth.getBalance(address);
  const eth = web3.utils.fromWei(wei,'ether')
  console.log(eth);
  return eth;
};

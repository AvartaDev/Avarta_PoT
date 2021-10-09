import {ethers} from 'ethers';

/**
 * @desc web3 http instance
 */
export let web3Provider = new JsonRpcProvider(
  replace(infuraUrl, 'network', NetworkTypes.mainnet),
  NetworkTypes.mainnet,
);

/**
 * @desc returns a web3 provider for the specified network
 * @param {String} network
 */
export const getProviderForNetwork = async network => {
  if (networkProviders[network]) {
    return networkProviders[network];
  }
  if (network.startsWith('http://')) {
    return new JsonRpcProvider(network, NetworkTypes.mainnet);
  } else {
    let url;
    switch (network) {
      case NetworkTypes.arbitrum:
        url = ARBITRUM_MAINNET_RPC;
        break;
      case NetworkTypes.optimism:
        url = OPTIMISM_MAINNET_RPC;
        break;
      case NetworkTypes.polygon:
        url = POLYGON_MAINNET_RPC;
        break;
      default:
        url = replace(infuraUrl, 'network', network);
    }
    const provider = new JsonRpcProvider(url);
    networkProviders[network] = provider;
    await provider.ready;
    return provider;
  }
};

export const sendRpcCall = async (payload, provider = null) =>
  (provider || web3Provider).send(payload.method, payload.params);

export const getTransactionReceipt = (txHash, provider = null) =>
  sendRpcCall(
    {
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    },
    provider,
  );

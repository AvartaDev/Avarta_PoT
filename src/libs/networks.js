import { ETH_WALLET_KEY } from '@constants/keys.js';
import URL from 'url-parse';
import {
  MAINNET,
  ROPSTEN,
  KOVAN,
  RINKEBY,
  GOERLI,
  RPC,
  SOLANA_TEST,
  BSC_TEST,
  BSC,
} from '../constants/networkConstants.js';

/**
 * List of the supported networks
 * including name, id, and color
 *
 * This values are used in certain places like
 * navbar and the network switcher.
 */

export const NetworkList = {
  [MAINNET]: {
    name: 'Ethereum Main Network',
    shortName: 'Ethereum',
    networkId: 1,
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/e9c4665d91a343e295308d5995ff5a72',
    hexChainId: '0x1',
    color: '#3cc29e',
    networkType: 'mainnet',
  },
  [ROPSTEN]: {
    name: 'Ropsten Test Network',
    shortName: 'Ropsten',
    networkId: 3,
    chainId: 3,
    rpcUrl:'https://ropsten.infura.io/v3/b4e2adbc89864b418a28043c075c625b',
    hexChainId: '0x3',
    color: '#ff4a8d',
    networkType: 'ropsten',
    getTransactionUrl: (txHash) => (`https://ropsten.etherscan.io/tx/${txHash}`)
  },
  [KOVAN]: {
    name: 'Kovan Test Network',
    shortName: 'Kovan',
    networkId: 42,
    chainId: 42,
    rpcUrl: 'https://kovan.infura.io/v3/e9c4665d91a343e295308d5995ff5a72',
    hexChainId: '0x2a',
    color: '#7057ff',
    networkType: 'kovan',
  },
  [RINKEBY]: {
    name: 'Rinkeby Test Network',
    shortName: 'Rinkeby',
    networkId: 4,
    chainId: 4,
    rpcUrl: 'https://rinkeby.infura.io/v3/e9c4665d91a343e295308d5995ff5a72',
    hexChainId: '0x4',
    color: '#f6c343',
    networkType: 'rinkeby',
  },
  [SOLANA_TEST]: {
    name: 'remote proxy - solana testnet',
    networkId: 111,
    chainId: 111,
    hexChainId: '0x6f',
    color: '#3099f2',
    networkType: 'solanaTest',
  },
  [BSC_TEST]: {
    name: 'Bsc Test',
    networkId: 97,
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    hexChainId: '0x61',
    color: '#3099f2',
    networkType: 'bscTest',
  },
  [RPC]: {
    name: 'Private Network',
    shortName: 'Private',
    networkType: 'rpc',
  },
};



const NetworkListKeys = Object.keys(NetworkList);

export default NetworkList;

export const TokenNetworkMapping = {
  [ETH_WALLET_KEY]: {...NetworkList.ropsten}
}

export const getAllNetworks = () =>
  NetworkListKeys.filter(name => name !== RPC);

export const isMainNet = network =>
  network?.provider?.type === MAINNET || network === String(1);

export const getDecimalChainId = chainId => {
  if (!chainId || typeof chainId !== 'string' || !chainId.startsWith('0x')) {
    return chainId;
  }
  return parseInt(chainId, 16).toString(10);
};

export const isMainnetByChainId = chainId =>
  getDecimalChainId(String(chainId)) === String(1);

export const getNetworkName = id =>
  NetworkListKeys.find(key => NetworkList[key].networkId === Number(id));

export function getNetworkTypeById(id) {
  if (!id) {
    throw new Error('Missing network Id');
  }
  const network = NetworkListKeys.filter(
    key => NetworkList[key].networkId === parseInt(id, 10),
  );
  if (network.length > 0) {
    return network[0];
  }

  throw new Error(`Unknown network with id ${id}`);
}

export function hasBlockExplorer(key) {
  return key.toLowerCase() !== RPC;
}

export function isKnownNetwork(id) {
  const knownNetworks = NetworkListKeys.map(
    key => NetworkList[key].networkId,
  ).filter(id => id !== undefined);
  return knownNetworks.includes(parseInt(id, 10));
}

export function isprivateConnection(hostname) {
  return (
    hostname === 'localhost' ||
    /(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/.test(
      hostname,
    )
  );
}

/**
 * Returns custom block explorer for specific rpcTarget
 *
 * @param {string} rpcTarget
 * @param {array<object>} frequentRpcList
 */
export function findBlockExplorerForRpc(rpcTarget, frequentRpcList) {
  const frequentRpc = frequentRpcList.find(({rpcUrl}) => rpcTarget === rpcUrl);
  if (frequentRpc) {
    return frequentRpc.rpcPrefs && frequentRpc.rpcPrefs.blockExplorerUrl;
  }
  return undefined;
}

/**
 * From block explorer url, get rendereable name or undefined
 *
 * @param {string} blockExplorerUrl - block explorer url
 */
export function getBlockExplorerName(blockExplorerUrl) {
  if (!blockExplorerUrl) return undefined;
  const hostname = new URL(blockExplorerUrl).hostname;
  if (!hostname) return undefined;
  const tempBlockExplorerName = hostname.split('.')[0];
  if (!tempBlockExplorerName || !tempBlockExplorerName[0]) return undefined;
  return (
    tempBlockExplorerName[0].toUpperCase() + tempBlockExplorerName.slice(1)
  );
}

/**
 * Checks whether the given number primitive chain ID is safe.
 * Because some cryptographic libraries we use expect the chain ID to be a
 * number primitive, it must not exceed a certain size.
 *
 * @param {number} chainId - The chain ID to check for safety.
 * @returns {boolean} Whether the given chain ID is safe.
 */
export function isSafeChainId(chainId) {
  return (
    Number.isSafeInteger(chainId) && chainId > 0 && chainId <= 4503599627370476
  );
}

/**
 * Checks whether the given value is a 0x-prefixed, non-zero, non-zero-padded,
 * hexadecimal string.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is a correctly formatted hex string,
 * false otherwise.
 */
export function isPrefixedFormattedHexString(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^0x[1-9a-f]+[0-9a-f]*$/iu.test(value);
}

// export const getNetworkNonce = async ({from}) => {
//   const {TransactionController} = Engine.context;
//   const networkNonce = await util.query(
//     TransactionController.ethQuery,
//     'getTransactionCount',
//     [from, 'pending'],
//   );
//   return parseInt(networkNonce, 16);
// };

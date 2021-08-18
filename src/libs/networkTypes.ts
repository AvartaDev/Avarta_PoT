export enum Network {
  solana_testnet = 'solana_testnet',
  bsc_testnet = 'bsc_testnet',
  kovan = 'kovan',
  mainnet = 'mainnet',
  rinkeby = 'rinkeby',
  ropsten = 'ropsten',
}

// We need to keep this one until
// we have typescript everywhere
export default {
  solana_testnet: 'solana_testnet' as Network,
  bsc_testnet: 'bsc_testnet' as Network,
  kovan: 'kovan' as Network,
  mainnet: 'mainnet' as Network,
  rinkeby: 'rinkeby' as Network,
  ropsten: 'ropsten' as Network,
};

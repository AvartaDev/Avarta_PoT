import {makeStore} from './MakeStore';
const initialState = {
  walletError: null,
  totalWalletBalance: {eth: null},
  currentChainId: 1,
};

export const reducer = (state, action) => {};

export const {useDispatch, useStore, Provider} = makeStore(
  'WalletStore',
  initialState,
  reducer,
);

export const actions = {
  //wallet actions
  CREATE_WALLET: 'CREATE_WALLET',
  RETRIEVE_WALLET: 'RETRIEVE_WALLET',
  SIGN_DATA: 'SIGN_DATA',
  FUND_WALLET: 'FUND_WALLET',
  CREATE_WALLET_ERROR: 'CREATE_WALLET_ERROR',
  RETRIEVE_WALLET_ERROR: 'RETRIEVE_WALLET_ERROR',
  SIGN_DATA_ERROR: 'SIGN_DATA_ERROR',
  FUND_WALLET_ERROR: 'FUND_WALLET_ERROR',

  //network action
  SWITCH_NETWORK: 'SWITCH_NETWORK',
  SWITCH_NETWORK_ERROR: 'SWITCH_NETWORK_ERROR',

  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

import {makeStore} from './MakeStore';
const initialState = {
  walletError: null,
  totalWalletBalance: {eth: null},
  walletBalance: {
    eth: 0,
    bsc: 0,
    solana: 0,
  },
  currentChainId: 1,
  usersWallet: null,
  solanaWallet: null,
  fundWalletData: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_WALLET':
      return {
        ...state,
        usersWallet: action.payload,
        walletError: null,
      };
    case 'SET_WALLET_BALANCE':
      return {
        ...state,
        walletBalance: action.payload,
        walletError: null,
      };
    case 'CREATE_WALLET_FROMKEY':
      return {
        ...state,
        usersWallet: action.payload,
        walletError: null,
      };
    case 'FUND_WALLET':
      return {
        ...state,
        fundWalletData: action.payload,
        walletError: null,
      };

    case 'CHANGE_CHAIN_ID':
      return {
        ...state,
        currentChainId: action.payload,
      };
    case 'SET_SOLANA_WALLET':
      return {
        ...state,
        solanaWallet: action.payload,
      };
    default:
      return state;
  }
};

export const {useDispatch, useStore, Provider} = makeStore(
  'WalletStore',
  initialState,
  reducer,
);

export const actions = {
  //wallet actions
  CREATE_WALLET: 'CREATE_WALLET',
  CREATE_WALLET_FROMKEY: 'CREATE_WALLET_FROMKEY',
  RETRIEVE_WALLET: 'RETRIEVE_WALLET',
  SIGN_DATA: 'SIGN_DATA',
  FUND_WALLET: 'FUND_WALLET',
  WALLET_ERROR: 'WALLET_ERROR',
  SIGN_DATA_ERROR: 'SIGN_DATA_ERROR',
  FUND_WALLET_ERROR: 'FUND_WALLET_ERROR',
  SET_WALLET_BALANCE: 'SET_WALLET_BALANCE',
  SET_SOLANA_WALLET: 'SET_SOLANA_WALLET',
  //network action
  SWITCH_NETWORK: 'SWITCH_NETWORK',
  SWITCH_NETWORK_ERROR: 'SWITCH_NETWORK_ERROR',

  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

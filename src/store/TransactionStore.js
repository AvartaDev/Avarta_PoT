import {makeStore} from './MakeStore';
const initialState = {
  transactionTx: false,
  transactionTxError: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'TRANSACTION_SUCCESS':
      return {
        ...state,
        setPassword: action.payload,
        walletError: null,
      };
    case 'TRANSACTION_FAILED':
      return {
        ...state,
        setPassword: false,
        walletError: action.payload,
      };

    default:
      return state;
  }
};

export const {useDispatch, useStore, Provider} = makeStore(
  'TransactionStore',
  initialState,
  reducer,
);

export const actions = {
  //transaction actions
  TRANSACTION_SUCCESS: 'TRANSACTION_SUCCESS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

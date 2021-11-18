import {makeStore} from './MakeStore';
const initialState = {
  setPassword: false,
  createPasswordError: null,
  loginError: null,
  loginSuccess: false,
  username: '',
  password: '',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_PASSWORD':
      return {
        ...state,
        setPassword: action.payload,
        walletError: null,
      };
    case 'CREATE_PASSWORD_ERROR':
      return {
        ...state,
        setPassword: false,
        walletError: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginSuccess: action.payload,
        loginError: null,
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        loginSuccess: false,
        loginError: action.payload,
      };
    case 'SET_USER_CREDENTIALS':
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
      };

    default:
      return state;
  }
};

export const {useDispatch, useStore, Provider} = makeStore(
  'AuthStore',
  initialState,
  reducer,
);

export const actions = {
  //wallet actions
  CREATE_PASSWORD: 'CREATE_PASSWORD',
  CREATE_PASSWORD_ERROR: 'CREATE_PASSWORD_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_USER_CREDENTIALS: 'SET_USER_CREDENTIALS',
};

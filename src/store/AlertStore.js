import {makeStore} from './MakeStore';
import {SET_ALERT, REMOVE_ALERT, HIDE_ALERT} from './types';

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return {
        messages: [...state.messages, action.payload],
        hide: false,
      };

    case HIDE_ALERT:
      return {
        ...state,
        hide: true,
      };

    case REMOVE_ALERT:
      return {
        messages: [],
        hide: true,
      };

    default:
      return state;
  }
};

const initialState = {
  messages: [],
  hide: true,
};

export const {Provider, useDispatch, useStore} = makeStore(
  'AlertState',
  initialState,
  reducer,
);

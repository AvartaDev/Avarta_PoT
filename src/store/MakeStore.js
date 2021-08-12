import React from 'react';
import t from 'prop-types';
import {
  RNLog,
  // Parser,
  retreiveFromStorage,
  saveToStorage,
} from '@libs/utils';

export const CACHE_ACTION_KEY = 'UPDATE_FROM_STORAGE';

export const makeStore = (
  name,
  initial_state,
  reducer,
  options = {persist: false},
) => {
  const storeCtx = React.createContext();
  const dispatchCtx = React.createContext({});

  const Provider = ({children}) => {
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [store, dispatch] = React.useReducer(reducer, initial_state);
    dispatch.thunkify = a => () => dispatch(a);
    dispatch.curry = type => payload => dispatch({type, payload});

    React.useEffect(() => {
      if (options.persist) {
        if (isInitialized) {
          saveToStorage(name, store);
        }
      }
    }, [isInitialized, store]);

    const asyncHack = async () => {
      const newState = await retreiveFromStorage(name);

      if (newState.isJust) {
        dispatch({
          type: CACHE_ACTION_KEY,
          payload: newState.getOrElse(initial_state),
        });
      }

      setIsInitialized(true);
    };

    React.useEffect(() => {
      if (options.persist) {
        asyncHack();
      }
    }, []);

    return (
      <dispatchCtx.Provider value={dispatch}>
        <storeCtx.Provider value={store}>{children}</storeCtx.Provider>
      </dispatchCtx.Provider>
    );
  };

  Provider.propTypes = {
    children: t.node.isRequired,
  };

  const useStore = () => React.useContext(storeCtx);
  const useDispatch = () => React.useContext(dispatchCtx);

  return {useDispatch, useStore, Provider, Consumer: storeCtx.Consumer};
};

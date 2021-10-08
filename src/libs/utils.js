import * as R from 'ramda';
import {Maybe} from 'ramda-fantasy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toChecksumAddress} from 'ethereumjs-util';
import {BigNumber} from '@ethersproject/bignumber';
import {isHexString as isEthersHexString} from '@ethersproject/bytes';
import {isValidMnemonic as ethersIsValidMnemonic} from '@ethersproject/hdnode';
import {get, replace, startsWith} from 'lodash';
/**
 * Returns full checksummed address
 *
 * @param {String} address - String corresponding to an address
 * @returns {String} - String corresponding to full checksummed address
 */
export function renderFullAddress(address) {
  return address
    ? toChecksumAddress(address)
    : 'transactions.tx_details_not_available';
}
/**
 * @desc check if hex string
 * @param {String} value
 * @return {Boolean}
 */
export const isHexString = value => isEthersHexString(value);

export const toHex = value => BigNumber.from(value).toHexString();

export const isHexStringIgnorePrefix = value => {
  if (!value) return false;
  const trimmedValue = value.trim();
  const updatedValue = addHexPrefix(trimmedValue);
  return isHexString(updatedValue);
};

export const addHexPrefix = value =>
  startsWith(value, '0x') ? value : `0x${value}`;

/**
 * @desc is valid mnemonic
 * @param {String} value
 * @return {Boolean}
 */
export const isValidMnemonic = value => ethersIsValidMnemonic(value);

/**
 * Returns short address format
 *
 * @param {String} address - String corresponding to an address
 * @param {Number} chars - Number of characters to show at the end and beginning.
 * Defaults to 4.
 * @returns {String} - String corresponding to short address format
 */
export function renderShortAddress(address, chars = 4) {
  if (!address) return address;
  const checksummedAddress = toChecksumAddress(address);
  return `${checksummedAddress.substr(
    0,
    chars + 2,
  )}...${checksummedAddress.substr(-chars)}`;
}

/**
 * Returns address name if it's in known identities
 *
 * @param {String} address - String corresponding to an address
 * @param {Object} identities - Identities object
 * @returns {String} - String corresponding to account name. If there is no name, returns the original short format address
 */
export function renderAccountName(address, identities) {
  address = safeToChecksumAddress(address);
  if (identities && address && address in identities) {
    return identities[address].name;
  }
  return renderShortAddress(address);
}

/**
 * Imports a an account from a private key
 *
 * @param {String} private_key - String corresponding to a private key
 * @returns {Promise} - Returns a promise
 */
export async function importAccountFromPrivateKey(private_key) {
  if (isDevelopment()) {
    return;
  }
  //   const account = await importAccount(private_key);
  //   await saveAccount(account);
}

/**
 * Determines if a given string looks like a valid Ethereum address
 *
 * @param {address} string
 */
export function resemblesAddress(address) {
  return address.length === 2 + 20 * 2;
}

export function safeToChecksumAddress(address) {
  if (!address) return undefined;
  return toChecksumAddress(address);
}

export const attachLoader =
  setter =>
  (name, callback) =>
  (...args) => {
    const setLoadingTo = state => prevState => {
      return {
        ...prevState,
        [name]: state,
      };
    };

    setter(setLoadingTo(true));

    // Callback should return a promise;
    return callback(...args)
      .catch(err => {
        console.log(`ResponseError: [${name}]`, err.message);
        return Promise.reject(err);
      })
      .finally(() => setter(setLoadingTo(false)));
  };

const isDevelopment = () => process.env.NODE_ENV === 'development';

export const retreiveFromStorage = async key => {
  return Parser.safeJSON(await AsyncStorage.getItem(key));
};

export const saveToStorage = R.curry((key, value) => {
  if (R.isNil(value)) {
    return value;
  }
  AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
});

export const RNLog = R.curry((msg, data) => {
  if (isDevelopment()) {
    console.info(`<-->[${msg}] -->`, data);
  }
  return data;
});

export const toFixed = (num, precision) => {
  return (R.is(String, num) ? parseFloat(num) : num).toFixed(precision);
};

export const Parser = {
  safeJSON: value => {
    const parseWhenString = R.when(R.is(String), JSON.parse);

    try {
      return R.compose(Maybe.toMaybe, parseWhenString)(value);
    } catch {
      return Maybe.Nothing(null);
    }
  },
};

export const formatAmount = value =>
  value ? `${value}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0.00';
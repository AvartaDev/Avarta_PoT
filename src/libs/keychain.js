import {captureException, captureMessage} from '@sentry/react-native';
import {forEach, isNil} from 'lodash';
import DeviceInfo from 'react-native-device-info';
import '';
import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  AUTHENTICATION_TYPE,
  canImplyAuthentication,
  getAllInternetCredentials,
  getAllInternetCredentialsKeys,
  getInternetCredentials,
  getSupportedBiometryType,
  hasInternetCredentials,
  Options,
  resetInternetCredentials,
  Result,
  setInternetCredentials,
  UserCredentials,
} from 'react-native-keychain';
import logger from 'logger';
import {Platform} from 'react-native';

export async function saveString(key, value, accessControlOptions) {
  return new Promise(async (resolve, reject) => {
    try {
      await setInternetCredentials(key, key, value, accessControlOptions);
      logger.sentry(`Keychain: saved string for key: ${key}`);
      resolve();
    } catch (e) {
      logger.sentry(`Keychain: failed to save string for key: ${key}`, e);
      captureMessage('Keychain write first attempt failed');
      // wait for 1000ms using settimeout
      setTimeout(() => {}, 1000);

      try {
        await setInternetCredentials(key, key, value, accessControlOptions);
        logger.sentry(
          `Keychain: saved string for key: ${key} on second attempt`,
        );
        resolve();
      } catch (e) {
        logger.sentry(`Keychain: failed to save string for key: ${key}`, e);
        captureMessage('Keychain write second attempt failed');
        reject(e);
      }
    }
  });
}

export async function loadString(key, options = {}) {
  try {
    const credentials = await getInternetCredentials(key, options);
    if (credentials) {
      logger.log(`Keychain: loaded string for key: ${key}`);
      return credentials.password;
    }
    logger.sentry(`Keychain: string does not exist for key: ${key}`);
  } catch (err) {
    if (err.toString() === 'Error: User canceled the operation.') {
      return -1;
    }
    if (err.toString() === 'Error: Wrapped error: User not authenticated') {
      return -2;
    }
    logger.sentry(
      `Keychain: failed to load string for key: ${key} error: ${err}`,
    );
    captureException(err);
  }
  return null;
}

export async function saveObject(key, value, accessControlOptions) {
  const jsonValue = JSON.stringify(value);
  return saveString(key, jsonValue, accessControlOptions);
}

export async function loadObject(key, options = {}) {
  const jsonValue = await loadString(key, options);
  if (!jsonValue) return null;
  if (jsonValue === -1 || jsonValue === -2) {
    return jsonValue;
  }
  try {
    const objectValue = JSON.parse(jsonValue);
    logger.log(`Keychain: parsed object for key: ${key}`);
    return objectValue;
  } catch (err) {
    logger.sentry(
      `Keychain: failed to parse object for key: ${key} error: ${err}`,
    );
    captureException(err);
  }
  return null;
}

export async function remove(key) {
  try {
    await resetInternetCredentials(key);
    logger.log(`Keychain: removed value for key: ${key}`);
  } catch (err) {
    logger.log(
      `Keychain: failed to remove value for key: ${key} error: ${err}`,
    );
    captureException(err);
  }
}

export async function loadAllKeys() {
  try {
    const response = await getAllInternetCredentials();
    if (response) {
      return response.results;
    }
  } catch (err) {
    logger.sentry(`Keychain: failed to loadAllKeys error: ${err}`);
    captureException(err);
  }
  return null;
}

export async function getAllKeysAnonymized() {
  const data = {};
  const results = await loadAllKeys();
  forEach(results, result => {
    data[result?.username] = {
      length: result?.password?.length,
      nil: isNil(result?.password),
      type: typeof result?.password,
    };
  });
  return data;
}

export async function loadAllKeysOnly() {
  try {
    const response = await getAllInternetCredentialsKeys();
    if (response) {
      return response.results;
    }
  } catch (err) {
    logger.log(`Keychain: failed to loadAllKeys error: ${err}`);
    captureException(err);
  }
  return null;
}

export async function hasKey(key) {
  try {
    const result = await hasInternetCredentials(key);
    return result;
  } catch (err) {
    logger.sentry(
      `Keychain: failed to check if key ${key} exists -  error: ${err}`,
    );
    captureException(err);
  }
  return false;
}

export async function wipeKeychain() {
  try {
    const results = await loadAllKeys();
    if (results) {
      await Promise.all(
        results?.map(result => resetInternetCredentials(result.username)),
      );
      logger.log('keychain wiped!');
    }
  } catch (e) {
    logger.sentry('error while wiping keychain');
    captureException(e);
  }
}

export async function getPrivateAccessControlOptions() {
  let res = {};
  try {
    let canAuthenticate;

    if (Platform.OS == 'ios') {
      canAuthenticate = await canImplyAuthentication({
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
      });
    } else {
      const hasBiometricsEnabled = await getSupportedBiometryType();
      canAuthenticate = !!hasBiometricsEnabled;
    }

    let isSimulator = false;

    if (canAuthenticate) {
      isSimulator = __DEV__ && (await DeviceInfo.isEmulator());
    }
    if (canAuthenticate && !isSimulator) {
      res = {
        accessControl:
          Platform.OS === 'ios'
            ? ACCESS_CONTROL.USER_PRESENCE
            : ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      };
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return res;
}

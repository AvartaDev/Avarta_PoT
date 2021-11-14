import {
  EVENT_DATA_RESULT_KEY,
  AUTHENTICATE_EVENT_ID,
  EVENT_SUCCESS,
  EVENT_MESSAGE_KEY,
} from '@constants/events';
import {authenticate as _authenticate} from 'facetec-rn';

import {DeviceEventEmitter} from 'react-native';

export const authenticate = (refID, onSuccess, onFailure) => {
  DeviceEventEmitter.addListener(AUTHENTICATE_EVENT_ID, async data => {
    const isSuccess = data[EVENT_DATA_RESULT_KEY] === EVENT_SUCCESS;
    console.log(data)
    if (isSuccess) {
      console.log(`Authentication is successfull!`);
      onSuccess();
    } else {
      console.log(
        `Authentication Failure, message: ${data[EVENT_MESSAGE_KEY]}`,
      );
      onFailure();
    }
    DeviceEventEmitter.removeAllListeners(AUTHENTICATE_EVENT_ID);
  });
  console.log("launching facetec-rn authenticate")
  _authenticate(refID);
};

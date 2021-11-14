import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import useTheme from '@hooks/useTheme';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import BigText from '@components/text/BigText';
import {
  deleteLatestExternalDatabaseRefID,
  setLatestExternalDatabaseRefID,
} from '@libs/localPersistenceUtils';
import {enroll} from 'facetec-rn';
import {DeviceEventEmitter} from 'react-native';
import {DASHBOARD_NAVIGATOR} from '@constants/navigation';
import useDebugRefID from '@hooks/useDebugRefID';
import SmallText from '@components/text/SmallText';
import {ENROLL_EVENT_ID} from '@constants/events';
import {authenticate} from '@libs/facetecUtils';

const Login = ({navigation}) => {
  const {gutter} = useTheme();

  const {refID} = useDebugRefID();

  const enrollListener = async data => {
    const isSuccess = data['result'] === 'SUCCESS';

    if (isSuccess) {
      await setLatestExternalDatabaseRefID(data['latestExternalDatabaseRefID']);
      console.log(`navigating to home...`);
      navigation.navigate(DASHBOARD_NAVIGATOR);
      console.log(
        `Enroll Success, refID ${data['latestExternalDatabaseRefID']} is saved`,
      );
    } else {
      console.log(`Enroll Failure, message: ${data['message']}`);
    }
  };

  useEffect(() => {
    DeviceEventEmitter.addListener(ENROLL_EVENT_ID, async data =>
      enrollListener(data),
    );
  }, []);

  const LoginButton = () => (
    <Button
      text="LOG IN"
      onPress={() =>
        authenticate(refID, () => {
          navigation.navigate(DASHBOARD_NAVIGATOR);
        })
      }
    />
  );
  const SignupButton = () => <Button text="SIGN UP" onPress={() => enroll()} />;
  return (
    <ImageBackGroundView>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: gutter.lg,
          justifyContent: 'center',
        }}>
        <Image
          source={require('@assets/images/Logo.png')}
          style={{width: 120, height: 120}}
        />
        <BigText text={'Avarta Wallet'} />
        <SmallText text={`debug refID: ${refID}`} />
        {refID === '' ? <SignupButton /> : <LoginButton />}
        <Button
          text="(DEBUG) bypass login"
          onPress={() => navigation.navigate(DASHBOARD_NAVIGATOR)}
        />

        <Button
          text="(DEBUG) reset refID"
          onPress={() => deleteLatestExternalDatabaseRefID()}
        />
      </View>
    </ImageBackGroundView>
  );
};

export default Login;

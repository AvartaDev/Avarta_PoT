import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import useTheme from '@hooks/useTheme';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import BigText from '@components/text/BigText';
import {deleteLatestExternalDatabaseRefID, setLatestExternalDatabaseRefID} from '@libs/localPersistenceUtils';
import {authenticate, enroll} from 'facetec-rn';
import {DeviceEventEmitter} from 'react-native';
import {DASHBOARD_NAVIGATOR} from '@constants/navigation';
import useDebugRefID from '@hooks/useDebugRefID';
import SmallText from '@components/text/SmallText';

const Login = ({navigation}) => {
  const {gutter} = useTheme();

  const {refID} = useDebugRefID();

  useEffect(() => {
    DeviceEventEmitter.addListener('ENROLL', async data => {
      const isSuccess = data['result'] === 'SUCCESS';

      if (isSuccess) {
        await setLatestExternalDatabaseRefID(
          data['latestExternalDatabaseRefID'],
        );
        console.log(`navigating to home...`);
        navigation.navigate(DASHBOARD_NAVIGATOR);
        console.log(
          `Enroll Success, refID ${data['latestExternalDatabaseRefID']} is saved`,
        );
      } else {
        console.log(`Enroll Failure, message: ${data['message']}`);
      }
    });
  }, []);

  const LoginButton = () => <Button text="LOG IN" onPress={() => authenticate(refID)} />;
  const SignupButton = () => <Button text="SIGN UP" onPress={() => enroll()} />;
  const Override = () => (
    <Button
      text="(DEBUG) reset refID"
      onPress={() => deleteLatestExternalDatabaseRefID()}
    />
  );
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
        {refID === '' ? <SignupButton /> : <LoginButton/>}
        <Override />
      </View>
    </ImageBackGroundView>
  );
};

export default Login;

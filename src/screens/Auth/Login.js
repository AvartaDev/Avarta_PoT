import React, {Component, useEffect} from 'react';
import {View, Text, ImageBackground, Image, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import {Button, SpinnerButton} from '@components/Button';
import {PrimaryModal} from '@components/Modal';
import Solus from 'rnsolus';
import {useDispatch, actions} from '@store/AuthStore';

const SolusStepUpSuccessMsg = 'Workflow completed successfully';

const Login = ({navigation}) => {
  const [formData, setFormData] = React.useState({
    username: 'hong.loon',
    password: 'Abcd123a',
  });

  const {username, password} = formData;
  const dispatch = useDispatch();

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const {colors, gutter} = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);

  const onClickLogin = async () => {
    if (username === '') {
      Alert.alert('Avarta Wallet', 'Username is required');
      return;
    }
    if (password === '') {
      Alert.alert('Avarta Wallet', 'Password is required');
      return;
    }
    try {
      await dispatch({
        type: actions.SET_USER_CREDENTIALS,
        payload: {username, password},
      });

      const SERVER_BASE_URL = 'https://platform.solusconnect.com/';
      const ORGANISATION_KEY = 'A5014D70-7956-478E-9680-C9B6CEA67689';

      const DeviceKeyIdentifier = 'dO0FSfPMW7eAhYqLcFWbU24lhpl1fW0R';
      const FaceScanEncryptionKey =
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
        'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
        'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
        'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
        'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
        'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
        '8QIDAQAB\n' +
        '-----END PUBLIC KEY-----';
      Solus.onCreate(
        DeviceKeyIdentifier,
        FaceScanEncryptionKey,
        SERVER_BASE_URL,
        ORGANISATION_KEY,
      );
      const msg = await Solus.StepUpProcess(username, password);
      if (msg !== SolusStepUpSuccessMsg) {
        Alert.alert('Avarta Wallet', msg);
        return;
      }
      navigation.navigate('dashboard');
    } catch (e) {
      Alert.alert('Avarta Wallet', e.message);
    }
  };

  const onClickRegister = () => {
    navigation.navigate('register');
  };
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: gutter.lg,
            justifyContent: 'center',
          }}>
          <Image
            source={require('@assets/images/Logo.png')}
            style={{height: 80, aspectRatio: 1460 / 421}}
          />
        </View>
        <View style={{marginHorizontal: gutter.md, marginTop: '20%'}}>
          <LabelInput
            label="Username"
            value={formData.username}
            required
            onChangeText={handleChange('username')}
            placeholder="John"
            placeholderTextColor={colors.primary_grey}
          />
          <LabelInput
            label="Password"
            value={password}
            required
            onChangeText={handleChange('password')}
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <SpinnerButton
              loading={false}
              text="LOG IN"
              onPress={onClickLogin}
              style={{justifyContent: 'center'}}
            />
          </View>
          <Text
            onPress={onClickRegister}
            style={{
              color: colors.basic,
              textAlign: 'center',
              paddingTop: gutter.md,
              fontWeight: 'bold',
            }}>
            {' '}
            Sign Up
          </Text>
        </View>
        <PrimaryModal visible={modalVisible}>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Image
              source={require('@assets/images/alert.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                fontWeight: '500',
                fontSize: 18,
                paddingVertical: gutter.md,
                textAlign: 'center',
                color: colors.danger,
              }}>
              Are you sure you want to erase your wallet?
            </Text>
            <Text
              style={{
                fontWeight: '300',
                fontSize: 14,
                letterSpacing: 1.5,
                paddingVertical: gutter.sm,
                textAlign: 'center',
              }}>
              You can ONLY recover this wallet with your {''}
              <Text style={{fontWeight: 'bold'}}>
                Secret Recovery Phase
              </Text>{' '}
              Avarta foes not have your Secret Revovery Phase
            </Text>
            <Text
              style={{
                fontWeight: '300',
                fontSize: 14,
                letterSpacing: 1.5,
                textAlign: 'center',
              }}>
              Your current wallet, accounts and assets will be {''}
              <Text style={{fontWeight: 'bold'}}>
                removed from this app permanently.
              </Text>{' '}
              This action cannot be undone.
            </Text>
          </View>
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button
              style={{
                backgroundColor: colors.danger,
                color: colors.white,
                borderWidth: 1,
                borderColor: colors.primary_grey,
              }}
              text="I understand, continue"
              onPress={() => {
                navigation.navigate('register');
                setModalVisible(false);
              }}
            />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '7%',
            }}>
            <Button
              style={{
                backgroundColor: colors.white,
                color: colors.primary,
                borderWidth: 1,
                borderColor: colors.primary_grey,
              }}
              text="Cancel"
              textColor={colors.primary}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </PrimaryModal>
      </BgView>
    </ImageBackground>
  );
};

export default Login;

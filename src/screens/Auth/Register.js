import React, {useEffect} from 'react';
import {View, Text, ImageBackground, Image, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '../../components/Input';
import {SpinnerButton} from '@components/Button';
import useAuth from '@hooks/useAuth';
import {useStore, useDispatch, actions} from '@store/AuthStore';
import Solus from 'rnsolus';

const Register = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const store = useStore();

  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);

  const {username, password, solWallet} = store;
  const {createWallet} = useAuth();
  const dispatch = useDispatch();

  const SERVER_BASE_URL = 'https://platform.solusconnect.com/';
  const ORGANISATION_KEY = 'A5014D70-7956-478E-9680-C9B6CEA67689';

  const DeviceKeyIdentifier = 'dr33yhXwWE7gnyZaBxraLtZppdaArzFG';
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

  useEffect(async () => {
    Solus.onCreate(
      DeviceKeyIdentifier,
      FaceScanEncryptionKey,
      SERVER_BASE_URL,
      ORGANISATION_KEY,
    );
  }, []);

  const onClickLogin = async () => {
    setLoginLoading(true);
    try {
      const msg = await Solus.StepUpProcess(username, password);
      console.log(msg);

      if (!msg.toLowerCase().includes('completed')) {
        setTimeout(() => {
          Alert.alert('Avarta Wallet', msg);
        }, 200);

        setLoginLoading(false);
        return 0;
      }
      setLoginLoading(false);
      if (solWallet === null) {
        setTimeout(() => {
          Alert.alert(
            'Avarta Wallet',
            'Wallet is not created on this device. Please create wallet first by clicking "New User"',
          );
        }, 200);
        return 0;
      }
      navigation.navigate('dashboard');
    } catch (e) {
      Alert.alert('Avarta Wallet', e.message);
    }
    setLoginLoading(false);
  };
  const onClickRegister = async () => {
    setRegisterLoading(true);

    try {
      let msg = await Solus.EnrollProcess(username, password);
      if (msg.toLowerCase().includes('completed')) {
        await createWallet(password);
        setRegisterLoading(false);
        navigation.navigate('dashboard');
      } else {
        Alert.alert('Avarta Wallet', msg);
      }
    } catch (e) {
      console.log(e.message);
      if (e.message.includes('User already enrolled')) {
        await Solus.DeEnrollProcess(username, password);
        msg = await Solus.EnrollProcess(username, password);
        if (msg.toLowerCase().includes('completed')) {
          await createWallet(password);
          setRegisterLoading(false);
          navigation.navigate('dashboard');
        }
      } else {
        Alert.alert('Avarta Wallet', e.message);
      }
    }
    setRegisterLoading(false);
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
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <SpinnerButton
              loading={registerLoading}
              text="New User"
              onPress={onClickRegister}
              style={{justifyContent: 'center'}}
            />
          </View>
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <SpinnerButton
              loading={loginLoading}
              text="Login"
              onPress={onClickLogin}
              style={{justifyContent: 'center'}}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Register;

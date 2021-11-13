import React from 'react';
import {View, Text, ImageBackground, Image, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '../../components/Input';
import {SpinnerButton} from '@components/Button';
import useAuth from '@hooks/useAuth';
import {useDispatch, actions} from '@store/AuthStore';
import Solus from 'rnsolus';

const SolusEnrollSuccessMsg = 'Workflow completed successfully';

const Register = ({navigation}) => {
  const {colors, gutter} = useTheme();

  const [formData, setFormData] = React.useState({
    username: 'hong.loon',
    password: 'Abcd123a',
  });
  const [loading, setLoading] = React.useState(false);

  const {username, password} = formData;
  const {createWallet} = useAuth();
  const dispatch = useDispatch();

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const onClickRegister = async () => {
    setLoading(true);
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
      let msg = await Solus.EnrollProcess(username, password);
      if (msg === SolusEnrollSuccessMsg) {
        await createWallet(password);
        navigation.navigate('dashboard');
      } else {
        Alert.alert('Avarta Wallet', msg);
      }
    } catch (e) {
      if (e.message.includes('de-enroll')) {
        await Solus.DeEnrollProcess(username, password);
        msg = await Solus.EnrollProcess(username, password);
        if (msg === SolusEnrollSuccessMsg) {
          await createWallet(password);
          navigation.navigate('dashboard');
        }
      } else {
        Alert.alert('Avarta Wallet', e.message);
      }
    }
    setLoading(false);
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
            value={formData.password}
            required
            onChangeText={handleChange('password')}
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <SpinnerButton
              loading={loading}
              text="Create Wallet"
              onPress={onClickRegister}
              style={{justifyContent: 'center'}}
            />
          </View>
          <Text
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 20,
            }}>
            Already have an account?
            <Text
              onPress={() => navigation.navigate('login')}
              style={{
                color: colors.basic,
                fontWeight: 'bold',
              }}>
              {' '}
              Login
            </Text>
          </Text>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Register;

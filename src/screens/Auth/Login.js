import React, {Component, useEffect} from 'react';
import {View, Text, ImageBackground, Image, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import {SpinnerButton} from '@components/Button';
import {useDispatch, actions} from '@store/AuthStore';

const Login = ({navigation}) => {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const {username, password} = formData;
  const dispatch = useDispatch();

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const {colors, gutter} = useTheme();

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
      navigation.navigate('register');
    } catch (e) {
      Alert.alert('Avarta Wallet', e.message);
    }
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
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Login;

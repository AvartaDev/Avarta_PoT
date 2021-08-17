import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '../../components/Input';
import Button from '../../components/Button';

import useWallet from '@hooks/useWallet';

const Register = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {createWallet, wallet} = useWallet();

  const onClick = () => {
    createWallet();
    () => navigation.navigate('dashboard', {wallet});
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
            style={{width: 120, height: 120}}
          />
          <Text style={{color: colors.white, fontWeight: 'bold', fontSize: 29}}>
            Avarta Wallet
          </Text>
        </View>
        <View style={{marginHorizontal: gutter.md, marginTop: '20%'}}>
          <LabelInput
            label="Password"
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />
          <LabelInput
            label="Enter Password Again"
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button text="Create Wallet" onPress={onClick()} />
          </View>
          <Text
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: gutter.bottom,
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

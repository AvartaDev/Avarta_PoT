import React from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import Button from '@components/Button';
import useAuth from '@hooks/useAuth';

const Landing = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {wallet, getWalletBalance, walletBalance} = useWallet();
  const {solWallet} = useAuth();

  const onCreateWallet = async () => {
    if (password !== confirmPassword && password.length < 5) {
      Alert.alert('password does not match');
      return;
    }
    await createWallet(password);
    navigation.navigate('dashboard');
  };

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <View style={{marginHorizontal: gutter.md}}>
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button
              text="Create New Wallet"
              onPress={() => navigation.navigate('register')}
            />
          </View>
          <View style={{marginTop: '10%'}}>
            <Button
              text="Import Wallet"
              onPress={() => navigation.navigate('import')}
            />
          </View>

          <View style={{marginTop: '10%'}}>
            <Button
              text="Homepage"
              onPress={() => navigation.navigate('dashboard')}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Landing;

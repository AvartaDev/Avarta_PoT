import React from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '../../components/Input';
import Button from '../../components/Button';

const Login = ({navigation}) => {
  const {colors, gutter} = useTheme();
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
            label="Email Address"
            placeholder="John.doe@gmail.com"
            placeholderTextColor={colors.primary_grey}
          />
          <LabelInput
            label="Password"
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />

          <Text
            style={{
              color: colors.basic,
              fontWeight: '500',
              textAlign: 'center',
              paddingTop: 20,
            }}>
            Forgot Password ?
          </Text>

          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '13%'}}>
            <Button
              text="Sign In"
              onPress={() => navigation.navigate('dashboard')}
            />
          </View>
          <Text
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: gutter.bottom,
            }}>
            Don't have an account ?
            <Text
              style={{
                color: colors.basic,
                fontWeight: 'bold',
              }}>
              Sign Up here
            </Text>
          </Text>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Login;

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
            label="Password"
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />

          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button
              text="Sign In"
              onPress={() => navigation.navigate('dashboard')}
            />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: gutter.md,
            }}>
            <Text
              style={{
                color: colors.white,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'left',
              }}>
              Sign In with face ID
            </Text>
            <TouchableOpacity style={{padding: gutter.sm}}>
              <Image
                source={require('@assets/images/face-id.png')}
                style={{tintColor: colors.white, width: 28, height: 28}}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: colors.basic,
                fontWeight: 'bold',
                marginLeft: gutter.lg,
                textAlign: 'right',
              }}>
              Restore Wallet
            </Text>
          </View>
          <Text
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: gutter.bottom,
            }}>
            New to avarta?
            <Text
              style={{
                color: colors.basic,
                fontWeight: 'bold',
              }}>
              {' '}
              Create Wallet
            </Text>
          </Text>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Login;

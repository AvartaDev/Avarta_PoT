import React, { Component, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import Button from '@components/Button';
import {PrimaryModal} from '@components/Modal';
import useAuth from '@hooks/useAuth';

const Login = ({navigation}) => {
  const [password, setPassword] = React.useState('');
  const {loginUser} = useAuth();

  const handleChange = field => value => {
    setPassword({...password, [field]: value});
  };

  const {colors, gutter} = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);

  const onClick = async () => {
    await loginUser(password);
    navigation.navigate('dashboard');
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
            value={password}
            required
            onChangeText={handleChange('password')}
            placeholder="*********"
            secureTextEntry={true}
            placeholderTextColor={colors.primary_grey}
          />

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
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button text="LOG IN" onPress={onClick} />
          </View>
          <Text
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
              marginHorizontal: gutter.md,
              marginTop: gutter.lg,
            }}>
            Can't login? You can ERASE your current wallet and setup a new one
          </Text>
          <Text
            onPress={() => setModalVisible(true)}
            style={{
              color: colors.basic,
              textAlign: 'center',
              paddingTop: gutter.md,
              fontWeight: 'bold',
            }}>
            {' '}
            Reset Wallet
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
        <Text
        onPress={()=>{navigation.navigate('SolusLibrary')}}
              style={{
                position:'absolute',
                top:40,
                left:-5,
                color: colors.basic,
                fontWeight: 'bold',
                marginLeft: gutter.lg,
                textAlign: 'right',
              }}>
              Go to Library
            </Text>
      </BgView>
    </ImageBackground>
  );
};

export default Login;

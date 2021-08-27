import React from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import Button from '@components/Button';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {wallet} = useWallet();
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <View style={{marginHorizontal: gutter.md}}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 26,
            }}>
            Wallet Address
          </Text>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {wallet.address}
          </Text>
          <View style={{marginTop: '10%'}}>
            <Button
              text="Import Wallet"
              onPress={() => navigation.navigate('import')}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

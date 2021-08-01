import React from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';

const Home = () => {
  const {colors, gutter} = useTheme();
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            marginTop: gutter.lg,
            fontWeight: 'bold',
            fontSize: 26,
          }}>
          Total Portfolio
        </Text>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

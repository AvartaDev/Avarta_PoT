import React from 'react';
import {BgView} from '@components/Layout';
import {ImageBackground} from 'react-native';

const ImageBackGroundView = props => {
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>{props.children}</BgView>
    </ImageBackground>
  );
};
export default ImageBackGroundView;

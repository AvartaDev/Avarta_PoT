import React from 'react';
import { View, ImageBackground } from 'react-native';
import { BgView } from '@components/Layout';
import Button from '@components/Button';
import BigText from '@components/text/BigText';
const CreateMain = ({ navigation }) => {

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{ width: '100%', height: '100%' }}>
      <BgView>
        <BigText text={"Choose Wallet"}/>
        <View
          style={{ display: 'flex', alignItems: 'center', marginTop: '7%' }}>
          <Button text="Ethereum" onPress={() => { navigation.navigate('createviewdetails', { token: "ETHEREUM" }) }} />
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default CreateMain;

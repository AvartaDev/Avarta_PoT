import React from 'react';
import { View, ImageBackground } from 'react-native';
import { BgView } from '@components/Layout';
import Button from '@components/Button';
import BigText from '@components/text/BigText';
import { ETH_WALLET_KEY } from '@constants/keys';
import { CREATE_WALLET_DETAILS } from '@constants/navigation';

const CreateWalletMainScreen = ({ navigation }) => {

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{ width: '100%', height: '100%' }}>
      <BgView>
        <BigText text={"Choose Wallet"}/>
        <View
          style={{ display: 'flex', alignItems: 'center', marginTop: '7%' }}>
          <Button text="Ethereum" onPress={() => { navigation.navigate(CREATE_WALLET_DETAILS, { token: ETH_WALLET_KEY }) }} />
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default CreateWalletMainScreen;

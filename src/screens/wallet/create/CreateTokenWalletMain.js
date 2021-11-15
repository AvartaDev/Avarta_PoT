import React from 'react';
import {View, ImageBackground} from 'react-native';
import {BgView} from '@components/Layout';
import Button from '@components/Button';
import BigText from '@components/text/BigText';
import {ACTIVATED_TOKEN_WALLET_LIST} from '@constants/keys';
import {CREATE_WALLET_DETAILS} from '@constants/navigation';
import SmallText from '@components/text/SmallText';

const CreateTokenWalletMain = ({navigation}) => {
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView style={{alignItems:'center', justifyContent:'center'}}>
        <BigText text={'Token Wallet Creation'} />
        <SmallText style={{fontWeight:'normal'}} text="What token wallet do you want to create?"/>
        <View style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
          {ACTIVATED_TOKEN_WALLET_LIST.map(token => {
            return (
              <Button
                key= {token}
                text={token}
                onPress={() => {
                  navigation.navigate(CREATE_WALLET_DETAILS, {token});
                }}
              />
            );
          })}
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default CreateTokenWalletMain;

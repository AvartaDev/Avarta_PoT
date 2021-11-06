import React, {useState} from 'react';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import BigText from '@components/text/BigText';
import {Input} from 'react-native-elements';
import {sendTokens} from '@libs/WalletUtils';
import {VIEW_WALLET_DASHBOARD} from '@constants/navigation';
import Toast from 'react-native-toast-message';

const TokenTransferScreen = ({route, navigation}) => {
  const {wallet, token} = route.params;
  const defaultVal = '0.005';
  const [val, setVal] = useState(defaultVal);

  const defaultAddr = '0xb3ab4150085FCa6CBe449572555377d982C87bc8';
  const [targetAddr, setTargetAddr] = useState(defaultAddr);
  return (
    <ImageBackGroundView>
      <BigText text={`${token}: Transfer Tokens`} />
      <Input
        inputStyle={{color: 'white', fontSize: 15}}
        defaultValue={defaultAddr}
        onChangeText={text => {
          setTargetAddr(text);
        }}
      />
      <Input
        inputStyle={{color: 'white'}}
        defaultValue={defaultVal}
        onChangeText={text => {
          setVal(text);
        }}
        keyboardType={'numeric'}
      />
      <Button
        text="Send"
        onPress={async () => {
          const res = await sendTokens(targetAddr, val, token, wallet);
          console.log(res)
          if (res) navigation.navigate(VIEW_WALLET_DASHBOARD, {wallet, token});
        }}
      />
    </ImageBackGroundView>
  );
};

export default TokenTransferScreen;

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import Button from '@components/Button';
import useWallet from '@hooks/useWallet';

const TransferEth = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {sendFunds} = useWallet();

  const [formData, setFormData] = React.useState({
    amount: '',
    recepient: '',
  });

  const {amount, recepient} = formData;

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const onClick = async () => {
    if (amount === 0 && recepient === '') {
      Alert.alert('Enter an amount or recepient');
      return;
    }
    let txHash = await sendFunds(recepient, amount, 'eth');
    Alert.alert('Transaction successful');
    console.log(txHash, 'txhash');
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
          <Text style={{color: colors.white, fontWeight: 'bold', fontSize: 29}}>
            Transfer on Ethereum
          </Text>
        </View>
        <View style={{marginHorizontal: gutter.md, marginTop: '20%'}}>
          <LabelInput
            label="Amount"
            value={formData.amount}
            required
            onChangeText={handleChange('amount')}
            placeholderTextColor={colors.primary_grey}
          />
          <LabelInput
            label="Enter Recepient's Address"
            value={formData.recepient}
            onChangeText={handleChange('recepient')}
            placeholder="0x31...19Dd"
            placeholderTextColor={colors.primary_grey}
          />
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <Button text="Send Funds" onPress={() => onClick()} />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default TransferEth;

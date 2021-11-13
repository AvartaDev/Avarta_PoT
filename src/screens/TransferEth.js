import React, {useState} from 'react';
import {View, Text, ImageBackground, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import {SpinnerButton} from '@components/Button';
import useWallet from '@hooks/useWallet';

const TransferEth = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {sendFunds, wallet, walletBalance} = useWallet();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    recepient: '',
  });

  const {amount, recepient} = formData;

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const onTransfer = async () => {
    setLoading(true);
    if (amount === 0 || recepient === '') {
      Alert.alert('Enter an amount or recepient');
      return;
    }

    const newHash = await sendFunds(
      recepient,
      amount,
      'eth',
      wallet.privateKey,
    );
    setLoading(false);
    if (newHash) {
      Alert.alert(
        'Avarta Wallet',
        `Transaction successful!\n Transaction Id: ${newHash}\n\nhttps://ropsten.etherscan.io/tx/${newHash}`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('dashboard');
            },
          },
        ],
      );
    } else {
      Alert.alert('Avarta Wallet', 'Transaction failed. Please try again.');
    }
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
            marginHorizontal: gutter.md,
            justifyContent: 'center',
          }}>
          <Text style={{color: colors.white, fontWeight: 'bold', fontSize: 29}}>
            Transfer on Ethereum
          </Text>
        </View>

        <View style={{marginHorizontal: gutter.md, marginTop: '20%'}}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Address: {wallet.address}
          </Text>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Balance: {walletBalance.eth}
          </Text>
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
            <SpinnerButton
              loading={loading}
              text="Send Funds"
              onPress={onTransfer}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default TransferEth;

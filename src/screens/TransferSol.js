import React, {useState} from 'react';
import {View, Text, ImageBackground, Alert} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import {LabelInput} from '@components/Input';
import {SpinnerButton} from '@components/Button';
import useWallet from '@hooks/useWallet';
import useAuth from '../hooks/useAuth';

const TransferSol = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {sendSolana, walletBalance} = useWallet();
  const {solWallet} = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    amount: '',
    recepient: '',
  });

  const {amount, recepient} = formData;

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };

  const onTranfer = async () => {
    if (amount === 0 || recepient === '') {
      Alert.alert('Enter an amount or recepient');
      return;
    }
    const newHash = await sendSolana(recepient, amount, solWallet.privateKey);
    if (newHash) {
      Alert.alert(
        'Avarta Wallet',
        `Transaction successful!\n Transaction Id: ${newHash}\n\nhttps://explorer.solana.com/tx/${newHash}?cluster=devnet`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigation: ', navigation);
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
            Transfer Sol
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
            Address: {solWallet.address}
          </Text>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Balance: {walletBalance.solana}
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
            placeholder="DrbfT....ru1ywtTr1mG"
            placeholderTextColor={colors.primary_grey}
          />
          <View
            style={{display: 'flex', alignItems: 'center', marginTop: '7%'}}>
            <SpinnerButton
              loading={loading}
              text="Send Funds"
              onPress={onTranfer}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default TransferSol;

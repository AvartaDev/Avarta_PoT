import React from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { BgView } from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import Button from '@components/Button';
import useAuth from '@hooks/useAuth';

const WalletEntry = (coin, text) => <Text
  style={{
    color: colors.white,
    textAlign: 'center',
    marginTop: gutter.lg,
    fontWeight: 'bold',
    fontSize: 16,
  }}>
  {`${coin}: ${text}`}
</Text>

const Home = ({ navigation }) => {
  const { colors, gutter } = useTheme();
  const { wallet, getWalletBalance, walletBalance } = useWallet();
  const { solWallet } = useAuth();

  async function onPress() {
    await getWalletBalance(wallet.address, solWallet.address);
  }

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{ width: '100%', height: '100%' }}>
      <BgView>
        <View style={{ marginHorizontal: gutter.md }}>
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

          <View style={{ marginTop: '10%' }}>
            <Button text="Create Wallet" onPress={() => {navigation.navigate('create')}} />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

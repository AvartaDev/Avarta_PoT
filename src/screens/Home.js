import React from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import Button from '@components/Button';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {wallet, getWalletBalance, walletBalance} = useWallet();

  React.useEffect(() => {
    async () => {
      await getWalletBalance('0x41De1a4764378Ad92890d18F06BcA05aBe827763');
    };
  }, []);

  async function onPress() {
    await getWalletBalance('0x41De1a4764378Ad92890d18F06BcA05aBe827763');
  }

  console.log(walletBalance, 'walletBalance');
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <View style={{marginHorizontal: gutter.md}}>
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
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {wallet.address}
          </Text>
          <Text>Wallet: {walletBalance}</Text>
          <View style={{marginTop: '10%'}}>
            <Button text="Retrieve Bnb balance" onPress={onPress} />
          </View>
          <View style={{marginTop: '10%'}}>
            <Button
              text="Import Wallet"
              onPress={() => navigation.navigate('import')}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

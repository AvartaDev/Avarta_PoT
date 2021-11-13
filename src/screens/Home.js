import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text, ScrollView} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import {Button, SpinnerButton} from '@components/Button';
import useAuth from '@hooks/useAuth';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {wallet, getWalletBalance, walletBalance} = useWallet();
  const {solWallet} = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    await getWalletBalance(wallet.address, solWallet.address);
  }, [wallet, solWallet]);

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <ScrollView>
          <View style={{marginHorizontal: gutter.md}}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                marginTop: gutter.lg,
                fontWeight: 'bold',
                fontSize: 26,
              }}>
              Crypto Wallets
            </Text>
            {/* <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                marginTop: gutter.lg,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              BSC/ETH: {wallet.address}
            </Text>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                marginTop: gutter.lg,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              SOL: {solWallet.address}
            </Text> */}
            <View style={{marginTop: '10%'}}>
              <SpinnerButton
                loading={loading}
                text="Refresh Balance"
                onPress={async () => {
                  setLoading(true);
                  await getWalletBalance(wallet.address, solWallet.address);
                  setLoading(false);
                }}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text={`Ethereum ${walletBalance.eth} ETH`}
                onPress={() => navigation.navigate('transferEth')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text={`Binance ${walletBalance.bsc} BNB`}
                onPress={() => navigation.navigate('transferBSC')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text={`Solana ${walletBalance.solana} SOL`}
                onPress={() => navigation.navigate('transferSol')}
              />
            </View>
          </View>
        </ScrollView>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

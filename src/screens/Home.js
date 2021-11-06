import React from 'react';
import {View, ImageBackground, Text, ScrollView} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import useWallet from '../hooks/useWallet';
import Button from '@components/Button';
import useAuth from '@hooks/useAuth';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {wallet, getWalletBalance, walletBalance} = useWallet();
  const {solWallet} = useAuth();

  async function onPress() {
    await getWalletBalance(wallet.address, solWallet.address);
  }

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
            </Text>
            {/* <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                marginTop: gutter.lg,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              BNB balance: {walletBalance.bsc}
            </Text>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                marginTop: gutter.lg,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              Sol balance: {walletBalance.solana} sol
            </Text> */}
            <View style={{marginTop: '10%'}}>
              <Button text="Retrieve balance" onPress={onPress} />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text="Import Wallet"
                onPress={() => navigation.navigate('import')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text="Transfer on Ethereum"
                onPress={() => navigation.navigate('transferEth')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text="Transfer on BSC"
                onPress={() => navigation.navigate('transfer')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button
                text="Transfer on Solana"
                onPress={() => navigation.navigate('transferSol')}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <Button text="NFT" onPress={() => navigation.navigate('nft')} />
            </View>
          </View>
        </ScrollView>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

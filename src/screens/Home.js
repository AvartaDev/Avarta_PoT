import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import Button from '@components/Button';
import {getAllWallets} from '@libs/localPersistenceUtils';
import {ETH_WALLET_KEY} from '@constants/keys';
import {CREATE_WALLET_FLOW, VIEW_WALLET_DASHBOARD} from '@constants/navigation';
import WalletCard from '@components/WalletCard';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const [allWallets, setAllWallets] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const initWallets = async () => {
    setLoaded(false);
    const res = await getAllWallets();
    const parsedRes = JSON.parse(res);
    setAllWallets(parsedRes);
    setLoaded(true);
  };

  useEffect(() => {
    initWallets();
  }, []);

  const Wallet = ({token}) => (
    <WalletCard
      wallet={allWallets[token]}
      token={token}
      onPress={() =>
        navigation.navigate(VIEW_WALLET_DASHBOARD, {
          wallet: allWallets[token],
          token,
        })
      }
    />
  );

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
            HOME
          </Text>
          {loaded ? <Wallet token={ETH_WALLET_KEY} /> : null}

          <View style={{marginTop: '10%'}}>
            <Button
              text="Create Wallet"
              onPress={() => {
                navigation.navigate(CREATE_WALLET_FLOW);
              }}
            />
            <Button
              text="Refresh"
              onPress={() => {
                initWallets();
              }}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

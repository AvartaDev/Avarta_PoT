import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text, ScrollView} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import Button from '@components/Button';
import {getMasterWallet} from '@libs/localPersistenceUtils';
import {BSC_WALLET_KEY, ETH_WALLET_KEY} from '@constants/keys';
import {
  CREATE_WALLET_FLOW,
  VIEW_WALLET_DASHBOARD,
  WALLET_NAVIGATOR,
} from '@constants/navigation';
import WalletCard from '@components/WalletCard';
import SmallText from '@components/text/SmallText';
import useDebugRefID from '@hooks/useDebugRefID';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const [allWallets, setAllWallets] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const initWallets = async () => {
    setLoaded(false);
    const res = await getMasterWallet();
    const parsedRes = JSON.parse(res);
    parsedRes[BSC_WALLET_KEY] = parsedRes[ETH_WALLET_KEY];
    console.log(parsedRes);
    setAllWallets(parsedRes);
    setLoaded(true);
  };

  const {refID} = useDebugRefID();

  useEffect(() => {
    initWallets();
  }, []);

  const Wallet = ({token}) => (
    <WalletCard
      wallet={allWallets[token]}
      token={token}
      onPress={() =>
        navigation.navigate(WALLET_NAVIGATOR, {
          screen: VIEW_WALLET_DASHBOARD,
          params: {
            wallet: allWallets[token],
            token,
          },
        })
      }
    />
  );

  const activatedWallets = [ETH_WALLET_KEY, BSC_WALLET_KEY];

  const getMappedWallets = () => {
    console.log('GETMAPPEDWALLETS');
    return activatedWallets.map(token => {
      console.log(token);
      return <Wallet key={token} token={token} />;
    });
  };

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{
        width: '100%',
        height: '100%',
      }}>
      <BgView>
        <ScrollView style={{marginHorizontal: gutter.md}}>
          <View>
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
            <SmallText text={`debug refID: ${refID}`}/>
            {loaded ? getMappedWallets() : null}

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
        </ScrollView>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

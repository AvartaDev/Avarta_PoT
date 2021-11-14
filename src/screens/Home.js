import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text, ScrollView} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import Button from '@components/Button';
import {getMasterWallet} from '@libs/localPersistenceUtils';
import {
  ACTIVATED_TOKEN_WALLET_LIST,
  BSC_WALLET_KEY,
  ETH_WALLET_KEY,
} from '@constants/keys';
import {
  CREATE_WALLET_FLOW,
  TOKEN_WALLET_SCREEN,
  WALLET_NAVIGATOR,
} from '@constants/navigation';
import WalletCard from '@components/wallets/WalletCard';
import SmallText from '@components/text/SmallText';
import useDebugRefID from '@hooks/useDebugRefID';
import Toast from 'react-native-toast-message';

const Home = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const [masterWallet, setMasterWallet] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const initWallets = async () => {
    setLoaded(false);
    const res = await getMasterWallet();
    if (res) {
      setMasterWallet(res);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Master Wallet',
        text2: 'Master wallet cannot be found on phone',
      });
    }
    setLoaded(true);
  };

  const {refID} = useDebugRefID();

  useEffect(() => {
    initWallets();
  }, []);

  const WalletButtons = () => (
    <View>
      {Object.keys(masterWallet).map(token => (
        <Button
          key={token}
          text={token}
          onPress={() => {
            navigation.navigate(WALLET_NAVIGATOR, {
              screen: TOKEN_WALLET_SCREEN,
              params: {
                walletList: masterWallet[token],
                token,
              },
            });
          }}
        />
      ))}
    </View>
  );
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
            <SmallText text={`debug refID: ${refID}`} />
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
              {loaded && <WalletButtons />}
            </View>
          </View>
        </ScrollView>
      </BgView>
    </ImageBackground>
  );
};

export default Home;

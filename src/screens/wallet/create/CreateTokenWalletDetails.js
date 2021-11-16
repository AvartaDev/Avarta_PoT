import React, {useEffect, useState} from 'react';
import {View, ImageBackground, TextInput, ToastAndroid} from 'react-native';
import {BgView} from '@components/Layout';
import Button from '@components/Button';
import * as bip39 from 'react-native-bip39';
import BigText from '@components/text/BigText';
import {deriveAccountFromMnemonic} from '@libs/WalletUtils';
import {
  getLatestExternalDatabaseRefID,
  storeTokenWallet,
} from '@libs/localPersistenceUtils';
import {HOME} from '@constants/navigation';
import {Icon} from 'react-native-elements';
import {copyStringToClipboard, showAndroidToast} from '@libs/utils';
import WalletCard from '@components/wallets/WalletCard';
import {authenticate} from '@libs/facetecUtils';

const CreateTokenWalletDetails = ({route, navigation}) => {
  const {token} = route.params;
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState(null);
  const [showMnemonic, setShowMnemonic] = useState(true);

  const initMnemonic = async () => {
    const res = await bip39.generateMnemonic(256);
    setMnemonic(res);
  };
  useEffect(() => {
    initMnemonic();
  }, []);

  const PhraseView = () => (
    <BgView>
      <BigText text={'This is your mnemonic phrase'} />
      <View
        style={{
          margin: 8,
          height: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput
          multiline
          editable={false}
          style={{color: 'white', flex: 10}}
          defaultValue={mnemonic}
        />
        <View
          style={{
            flex: 1,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 10,
          }}>
          <Icon
            containerStyle={{
              flex: 1,
              height: 'auto',
              justifyContent: 'center',
            }}
            underlayColor="grey"
            color="white"
            name="clipboard-text-outline"
            type="material-community"
            onPress={() => {
              copyStringToClipboard(mnemonic);
            }}
          />
        </View>
      </View>
      <Button
        text={'I have saved it'}
        onPress={async () => {
          showAndroidToast('Generating wallet...', ToastAndroid.LONG);
          setTimeout(async () => {
            const result = await deriveAccountFromMnemonic(mnemonic);
            setWallet(result);
            setShowMnemonic(false);
          }, 100);
        }}
      />
    </BgView>
  );

  const WalletView = () => (
    <BgView>
      <BigText text={`This is your new ${token} wallet`} />
      <WalletCard minimal={true} wallet={wallet} token={token} />
      <Button
        text={'Save and go back to home page'}
        onPress={async () => {
          const refID = await getLatestExternalDatabaseRefID();
          authenticate(refID, async () => {
            await storeTokenWallet(token, wallet);
            navigation.navigate(HOME);
          });
        }}
      />
    </BgView>
  );

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        {showMnemonic && mnemonic ? <PhraseView /> : null}
        {wallet ? <WalletView /> : null}
      </BgView>
    </ImageBackground>
  );
};

export default CreateTokenWalletDetails;

import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { BgView } from '@components/Layout';
import Button from '@components/Button';
import * as bip39 from "react-native-bip39"
import BigText from '@components/text/BigText';
import { deriveAccountFromMnemonic } from '@libs/WalletUtils';
import SmallText from '@components/text/SmallText';
import { storeWallet } from '@libs/localPersistenceUtils';
import { HOME } from '@constants/navigation';


const CreateWalletDetailsScreen = ({ route, navigation }) => {
  const { token } = route.params
  const [wallet, setWallet] = useState(null)
  const [mnemonic, setMnemonic] = useState(null)


  const PhraseView = () =>
    <BgView>
      <BigText text={"This is your pass phrase, please save it"} />
      <SmallText text={mnemonic} />
      <Button text={"I have saved it"} onPress={async () => {
        console.log("pressed")
        const result = await deriveAccountFromMnemonic(mnemonic)
        console.log("received result")
        setWallet(result)
      }} />
    </BgView>

  const WalletView = () =>
    <BgView>
      <SmallText text={"Address"} />
      <SmallText text={wallet.address} />
      <SmallText text={"hd wallet"} />
      <SmallText text={wallet.isHDWallet.toString()} />
      <SmallText text={"public extended key base64"} />
      <SmallText text={wallet.publicExtendedKey} />
      <SmallText text={"prv extended key base64"} />
      <SmallText text={wallet.privateExtendedKey} />
      <Button text={"Save and go back to home page"} onPress={async () => {
        await storeWallet(token, wallet)
        navigation.navigate(HOME)
      }} />
    </BgView>


  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{ width: '100%', height: '100%' }}>
      <BgView>
        <BigText text={token} />
        <Button text="Create Wallet now" onPress={async () => {
          const res = await bip39.generateMnemonic(256)
          setMnemonic(res)
        }} />

        {mnemonic ? <PhraseView /> : null}
        {wallet ? <WalletView /> : null}



      </BgView>
    </ImageBackground>
  );
};

export default CreateWalletDetailsScreen;

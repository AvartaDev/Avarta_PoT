import React, {useState} from 'react';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import BigText from '@components/text/BigText';
import {Input, Text} from 'react-native-elements';
import {sendTokens} from '@libs/WalletUtils';
import {TOKEN_WALLET_SCREEN} from '@constants/navigation';
import SmallText from '@components/text/SmallText';
import {Linking, View} from 'react-native';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import {TokenNetworkMapping} from '@libs/networks';
import {addTransactionHistory} from '@libs/localPersistenceUtils';
import useDebugRefID from '@hooks/useDebugRefID';
import {authenticate} from '@libs/facetecUtils';

const TokenTransferScreen = ({route, navigation}) => {
  const {wallet, token} = route.params;
  const defaultVal = '0.001';
  const [val, setVal] = useState(defaultVal);
  const [transactionHash, setTransactionHash] = useState('');
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [url, setUrl] = useState('');

  const {refID} = useDebugRefID();

  const defaultAddr = '0xb3ab4150085FCa6CBe449572555377d982C87bc8';
  const [targetAddr, setTargetAddr] = useState(defaultAddr);

  const TransactionSuccessOverlay = () => {
    return (
      <Overlay visible={isOverlayVisible}>
        <View style={{padding: 8}}>
          <Text style={{marginTop: 8, fontSize: 20}}>
            Transaction Successful
          </Text>
          <Text style={{marginTop: 16, fontSize: 16}}>
            Transaction hash url:
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 16,
              color: 'lightblue',
              textDecorationLine: 'underline',
            }}
            onPress={() => {
              Linking.openURL(url);
            }}>
            {url}
          </Text>
          <Button
            text="Save and go back"
            onPress={() => {
              navigation.navigate(TOKEN_WALLET_SCREEN);
              setOverlayVisible(false);
            }}
          />
        </View>
      </Overlay>
    );
  };

  return (
    <ImageBackGroundView>
      <TransactionSuccessOverlay />
      <BigText text={`${token}: Transfer Tokens`} />
      <View style={{margin: 32}} />
      <SmallText style={{margin: 11}} text="Target Wallet Address:" />
      <Input
        selection={{start: 0, end: 0}}
        inputStyle={{color: 'white', fontSize: 15}}
        editable={false}
        defaultValue={wallet.address}
      />
      <SmallText style={{margin: 11}} text="Recipient Wallet Address:" />
      <Input
        // selection={{start: 0, end: 0}}
        inputStyle={{color: 'white', fontSize: 15}}
        defaultValue={defaultAddr}
        onChangeText={text => {
          setTargetAddr(text);
        }}
      />
      <SmallText style={{margin: 11}} text="Amount:" />
      <Input
        inputStyle={{color: 'white'}}
        defaultValue={defaultVal}
        onChangeText={text => {
          setVal(text);
        }}
        keyboardType={'numeric'}
      />

      <Button
        text="Send"
        onPress={() => {
          authenticate(refID, () => {
            console.log('authenticated...sending');
            sendTokens(targetAddr, val, token, wallet, hash => {
              setTransactionHash(hash);
              console.log(`hash received: ${hash}`);
              const _url = TokenNetworkMapping[token].getTransactionUrl(hash);
              setUrl(_url);
              addTransactionHistory(
                token,
                wallet.address,
                targetAddr,
                val,
                _url,
              );
              setOverlayVisible(true);
            });
          });
        }}
      />
    </ImageBackGroundView>
  );
};

export default TokenTransferScreen;

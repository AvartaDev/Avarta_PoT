import React, {useEffect, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {Button, Card, Icon, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SmallText from '@components/text/SmallText';
import {getWalletBalance} from '@libs/WalletUtils';
import {copyStringToClipboard, showAndroidToast} from '@libs/utils';
import {TOKEN_TRANSFER_SCREEN, WALLET_HISTORY_SCREEN} from '@constants/navigation';

const WalletCard = ({token, index, wallet, minimal = false, navigation}) => {
  const [balance, setBalance] = useState(0.0);
  const [showDetails, setShowDetails] = useState(false);

  const init = async () => {
    const res = await getWalletBalance(wallet.address, token);
    if (res) setBalance(res);
    else console.log(`COULD NOT FETCH BALANCE FOR ${token}::${address}`);
  };

  useEffect(() => {
    init();
  }, []);

  const Details = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => copyStringToClipboard(wallet.walletPub)}>
          <View style={{flexDirection: 'row'}}>
            <SmallText
              text="Pub"
              style={{color: 'black', fontSize: 10, margin: 10}}
            />
            <SmallText
              text={wallet.walletPub}
              style={{color: 'black', fontSize: 10, margin: 10}}
            />
          </View>
        </TouchableOpacity>

        <Card.Divider />

        <TouchableOpacity
          onPress={() => copyStringToClipboard(wallet.walletPrv)}>
          <View style={{flexDirection: 'row'}}>
            <SmallText
              text="Prv"
              style={{color: 'black', fontSize: 10, margin: 10}}
            />
            <SmallText
              text={wallet.walletPrv}
              style={{color: 'black', fontSize: 10, margin: 10}}
            />
          </View>
        </TouchableOpacity>
        <Card.Divider />
      </View>
    );
  };

  const Buttons = () => (
    <View style={{flexDirection: 'row'}}>
      <Button
        containerStyle={{flex: 1, margin: 4}}
        title="Transfer Token"
        onPress={() => {
          navigation.navigate(TOKEN_TRANSFER_SCREEN, {wallet, token});
        }}
      />

      <Button
        containerStyle={{flex: 1, margin: 4}}
        title="View History"
        onPress={() => {
          navigation.navigate(WALLET_HISTORY_SCREEN, {wallet, token});
        }}
      />
    </View>
  );

  return (
    <Card>
      <Card.Title>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => {
            setShowDetails(!showDetails);
          }}>
          <Text>{`Wallet ${index}`}</Text>
          {!minimal && (
            <Icon name={showDetails ? 'expand-less' : 'expand-more'} />
          )}
        </TouchableOpacity>
      </Card.Title>

      <Card.Divider />

      <TouchableOpacity onPress={() => copyStringToClipboard(wallet.address)}>
        <View style={{flexDirection: 'row'}}>
          <SmallText
            text="Address"
            style={{color: 'black', fontSize: 10, margin: 10}}
          />
          <SmallText
            text={wallet.address}
            style={{color: 'black', fontSize: 10, margin: 10}}
          />
        </View>
      </TouchableOpacity>

      <Card.Divider />

      <TouchableOpacity
        onPress={() => {
          showAndroidToast('Refreshing balance...', ToastAndroid.LONG);
          init();
        }}>
        <View style={{flexDirection: 'row'}}>
          <SmallText
            text="Current Balance"
            style={{color: 'black', fontSize: 10, margin: 10}}
          />
          <SmallText
            text={balance}
            style={{color: 'black', fontSize: 10, margin: 10}}
          />
        </View>
      </TouchableOpacity>

      <Card.Divider />

      {showDetails && !minimal && <Details />}
      {!minimal && <Buttons />}
    </Card>
  );
};

export default WalletCard;

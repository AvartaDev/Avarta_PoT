import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-elements';
import {TouchableHighlight} from 'react-native-gesture-handler';
import SmallText from './text/SmallText';
import ClipBoard from '@react-native-clipboard/clipboard';
import {getWalletBalance} from '@libs/WalletUtils';

const WalletCard = ({token, wallet, showDetails = false, onPress = null}) => {
  const [balance, setBalance] = useState(0.0);

  const init = async () => {
    const res = await getWalletBalance(wallet.address, token);
    if(res)
      setBalance(res);
    else
      console.log(`COULD NOT FETCH BALANCE FOR ${token}::${address}`)
  };
  useEffect(() => {
    init();
  }, []);
  const Details = () => {
    return (
      <View>
        <TouchableHighlight onPress={() => init()}>
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
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <Card>
      <TouchableHighlight onPress={onPress}>
        <Card.Title>{token}</Card.Title>
      </TouchableHighlight>

      <Card.Divider />

      <TouchableHighlight onPress={() => ClipBoard.setString(wallet.address)}>
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
      </TouchableHighlight>

      <Card.Divider />

      <TouchableHighlight onPress={() => ClipBoard.setString(wallet.walletPub)}>
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
      </TouchableHighlight>

      <Card.Divider />

      <TouchableHighlight onPress={() => ClipBoard.setString(wallet.walletPrv)}>
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
      </TouchableHighlight>

      <Card.Divider />

      {showDetails ? <Details /> : null}
    </Card>
  );
};

export default WalletCard;

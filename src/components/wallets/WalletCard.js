import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Card, Icon, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SmallText from '@components/text/SmallText';
import {getWalletBalance} from '@libs/WalletUtils';
import {copyStringToClipboard} from '@libs/utils';
import Button from '@components/Button';

const WalletCard = ({token, wallet, sendTokenCallback = () => {}}) => {
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

  return (
    <Card>
      <Card.Title>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => {
            setShowDetails(!showDetails);
          }}>
          <Text>{token}</Text>
          <Icon name={showDetails ? 'expand-less' : 'expand-more'} />
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

      <TouchableOpacity onPress={() => init()}>
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

      {showDetails ? <Details /> : null}

      <Button text="Send tokens from this wallet" onPress={()=> sendTokenCallback()} />
    </Card>
  );
};

export default WalletCard;

import React, {useEffect, useState} from 'react';
import BigText from '@components/text/BigText';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import {getTransactionHistory} from '@libs/localPersistenceUtils';
import {Card, Icon, Text} from 'react-native-elements';
import {Linking, View} from 'react-native';
import SmallText from '@components/text/SmallText';
import {copyStringToClipboard} from '@libs/utils';

const WalletHistoryScreen = ({route, navigation}) => {
  const {token, wallet} = route.params;
  const [history, setHistory] = useState();
  const [showHistory, setShowHistory] = useState(false);

  const initHistory = async () => {
    const res = await getTransactionHistory(token, wallet.address);
    console.log(res);
    setHistory(res.history);
    setShowHistory(true);
  };
  useEffect(() => {
    initHistory();
  }, []);

  return (
    <ImageBackGroundView>
      <BigText text="History" />
      {showHistory &&
        history.reverse().map(entry => {
          return (
            <Card>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', flex: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <SmallText
                      style={{color: 'black', marginRight: 8}}
                      text="Transfer"
                    />
                    <SmallText
                      style={{color: 'black', marginRight: 8}}
                      text={entry.value}
                    />
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <SmallText
                      style={{color: 'black', marginRight: 8}}
                      text="To"
                    />
                    <SmallText
                      style={{color: 'black', marginRight: 8}}
                      text={`${entry.to.substring(0, 25)}...`}
                    />
                  </View>
                </View>
                <Icon
                  containerStyle={{
                    flex: 1,
                    height: 'auto',
                    justifyContent: 'center',
                  }}
                  name="clipboard-text-outline"
                  type="material-community"
                  onPress={() => copyStringToClipboard(entry.to)}
                />
                <Icon
                  containerStyle={{
                    flex: 1,
                    height: 'auto',
                    justifyContent: 'center',
                  }}
                  name="launch"
                  type="material-community"
                  color={entry.url ? 'black' : 'lightgrey'}
                  onPress={() => {
                    if (entry.url) {
                      Linking.openURL(entry.url);
                    }
                  }}
                />
              </View>
            </Card>
          );
        })}
    </ImageBackGroundView>
  );
};

export default WalletHistoryScreen;

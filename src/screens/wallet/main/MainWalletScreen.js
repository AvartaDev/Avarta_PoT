import React, {useEffect} from 'react';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import WalletCard from '@components/wallets/WalletCard';
import BigText from '@components/text/BigText';
import {ScrollView} from 'react-native-gesture-handler';
const MainWalletScreen = ({route, navigation}) => {
  const {token, walletList} = route.params;
  useEffect(() => {
    console.log(token, walletList);
  }, []);
  return (
    <ImageBackGroundView>
      <BigText text={`Your ${token} Wallets`} />
      <ScrollView>
        {walletList.map((value, index) => (
          <WalletCard wallet={value} token={token} index={index + 1} navigation={navigation} />
        ))}
      </ScrollView>
    </ImageBackGroundView>
  );
};



export default MainWalletScreen;

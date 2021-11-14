import React, {useEffect} from 'react';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import WalletCard from '@components/wallets/WalletCard';
import {TRANSFER_TOKEN_SCREEN} from '@constants/navigation';
import BigText from '@components/text/BigText';

const MainWalletScreen = ({route, navigation}) => {
  const {token, walletList} = route.params;
  useEffect(() => {
    console.log(token, walletList);
  }, []);
  return (
    <ImageBackGroundView>
      <BigText text={`${token} WALLETS`} />
      {walletList.map((value, index) => (
        <WalletCard
          wallet={value}
          token={`Wallet ${index + 1}`}
          sendTokenCallback={() =>
            navigation.navigate(TRANSFER_TOKEN_SCREEN, {value, token})
          }
        />
      ))}
    </ImageBackGroundView>
  );
};

export default MainWalletScreen;

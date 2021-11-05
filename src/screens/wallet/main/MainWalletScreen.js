import React from 'react';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import WalletCard from '@components/WalletCard';
import { TRANSFER_TOKEN_SCREEN } from '@constants/navigation';

const MainWalletScreen = ({route, navigation}) => {
  const {wallet, token} = route.params;
  return (
    <ImageBackGroundView>
      <WalletCard wallet={wallet} token={token} showDetails={true} />
      <Button text="Refresh" />
      <Button text="Send Token" onPress={() => navigation.navigate(TRANSFER_TOKEN_SCREEN, {wallet, token})}/>
    </ImageBackGroundView>
  );
};

export default MainWalletScreen;

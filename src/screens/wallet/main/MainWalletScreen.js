import React from 'react';
import Button from '@components/Button';
import ImageBackGroundView from '@components/views/ImageBackGroundView';
import WalletCard from '@components/WalletCard';

const MainWalletScreen = ({route, navigation}) => {
  const {wallet, token} = route.params;
  return (
    <ImageBackGroundView>
      <WalletCard wallet={wallet} token={token} showDetails={true} />
      <Button text="Refresh" />
    </ImageBackGroundView>
  );
};

export default MainWalletScreen;

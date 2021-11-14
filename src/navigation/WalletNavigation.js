import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { TRANSFER_TOKEN_SCREEN, TOKEN_WALLET_SCREEN } from '@constants/navigation';
import MainWalletScreen from '@screens/wallet/main/MainWalletScreen';
import TokenTransferScreen from '@screens/wallet/main/TokenTransferScreen';

const Stack = createStackNavigator();

const WalletNavigation = (route, navigation) => {

  return (
    <Stack.Navigator
      initialRouteName={TOKEN_WALLET_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={TOKEN_WALLET_SCREEN} component={MainWalletScreen} route={route}/>
      <Stack.Screen name={TRANSFER_TOKEN_SCREEN} component={TokenTransferScreen}/>
    </Stack.Navigator>
  );
};

export default WalletNavigation;

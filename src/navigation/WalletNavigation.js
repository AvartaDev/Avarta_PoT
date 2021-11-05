import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { TRANSFER_TOKEN_SCREEN, VIEW_WALLET_DASHBOARD } from '@constants/navigation';
import MainWalletScreen from '@screens/wallet/main/MainWalletScreen';
import TokenTransferScreen from '@screens/wallet/main/TokenTransferScreen';

const Stack = createStackNavigator();

const WalletNavigation = (route, navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={VIEW_WALLET_DASHBOARD}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={VIEW_WALLET_DASHBOARD} component={MainWalletScreen}/>
      <Stack.Screen name={TRANSFER_TOKEN_SCREEN} component={TokenTransferScreen}/>
    </Stack.Navigator>
  );
};

export default WalletNavigation;

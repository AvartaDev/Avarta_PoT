import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  WALLET_HISTORY_SCREEN,
  TOKEN_TRANSFER_SCREEN,
  TOKEN_WALLET_SCREEN,
} from '@constants/navigation';
import MainWalletScreen from '@screens/wallet/main/MainWalletScreen';
import TokenTransferScreen from '@screens/wallet/main/TokenTransferScreen';
import WalletHistoryScreen from './WalletHistoryScreen';

const Stack = createStackNavigator();

const WalletNavigation = (route, navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={TOKEN_WALLET_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={TOKEN_WALLET_SCREEN}
        component={MainWalletScreen}
        route={route}
      />
      <Stack.Screen
        name={TOKEN_TRANSFER_SCREEN}
        component={TokenTransferScreen}
      />
      <Stack.Screen
        name={WALLET_HISTORY_SCREEN}
        component={WalletHistoryScreen}
      />
    </Stack.Navigator>
  );
};

export default WalletNavigation;

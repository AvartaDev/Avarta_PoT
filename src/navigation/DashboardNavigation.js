import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';
import CreateWalletNavigation from './CreateWalletNavigation';
import { CREATE_WALLET_FLOW, HOME, WALLET_NAVIGATOR } from '@constants/navigation';
import WalletNavigation from './WalletNavigation';

const Stack = createStackNavigator();

const DashboardNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={'home'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={HOME} component={Home} />
      <Stack.Screen name={CREATE_WALLET_FLOW} component={CreateWalletNavigation} />
      <Stack.Screen name={WALLET_NAVIGATOR} component={WalletNavigation}/>
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

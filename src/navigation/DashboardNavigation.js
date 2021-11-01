import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';
import CreateWalletNavigation from './CreateWalletNavigation';
import { CREATE_WALLET_FLOW, HOME, VIEW_WALLET_DASHBOARD } from '@constants/navigation';
import MainWalletScreen from '@screens/wallet/main/MainWalletScreen';

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
      <Stack.Screen name={VIEW_WALLET_DASHBOARD} component={MainWalletScreen}/>
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

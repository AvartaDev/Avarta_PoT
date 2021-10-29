import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';
import Import from '@screens/Import';
import Transfer from '@screens/Transfer';
import TransferSol from '../screens/TransferSol';
import CreateMain from '@screens/wallet/create/CreateMain'
import NFT from '../screens/NFT';
import CreateWalletNavigation from './CreateWalletNavigation';

const Stack = createStackNavigator();

const DashboardNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="import" component={Import} />
      <Stack.Screen name="transfer" component={Transfer} />
      <Stack.Screen name="transferSol" component={TransferSol} />
      <Stack.Screen name="create" component={CreateWalletNavigation}/>
      <Stack.Screen name="nft" component={NFT} />
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

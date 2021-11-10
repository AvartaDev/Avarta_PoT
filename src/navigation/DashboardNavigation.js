import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';
import Import from '@screens/Import';
import TransferBSC from '@screens/TransferBSC';
import TransferEth from '@screens/TransferEth';
import TransferSol from '@screens/TransferSol';
import NFT from '@screens/NFT';

const Stack = createStackNavigator();

const DashboardNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="import" component={Import} />
      <Stack.Screen name="transferBSC" component={TransferBSC} />
      <Stack.Screen name="transferEth" component={TransferEth} />
      <Stack.Screen name="transferSol" component={TransferSol} />
      <Stack.Screen name="nft" component={NFT} />
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

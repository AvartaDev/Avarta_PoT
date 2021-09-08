import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';
import Import from '@screens/Import';
import Transfer from '@screens/Transfer';
import TransferSol from '../screens/TransferSol';

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
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

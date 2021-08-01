import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@screens/Home';

const Stack = createStackNavigator();

const DashboardNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
};

export default DashboardNavigation;

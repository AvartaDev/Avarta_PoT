import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator from '@navigation/AuthNavigator';
import DashboardNavigation from '@navigation/DashboardNavigation';
import { AUTH_NAVIGATOR, DASHBOARD_NAVIGATOR } from '@constants/navigation';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={AUTH_NAVIGATOR} component={AuthNavigator} />
        <Stack.Screen name={DASHBOARD_NAVIGATOR} component={DashboardNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

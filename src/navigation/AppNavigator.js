import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigation from '@navigation/AuthNavigation';
import DashboardNavigation from '@navigation/DashboardNavigation';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName="auth"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="auth" component={AuthNavigation} />
        <Stack.Screen name="dashboard" component={DashboardNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

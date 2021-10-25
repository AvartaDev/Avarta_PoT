import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '@screens/Auth/Login';
import Register from '@screens/Auth/Register';
import SolusLibrary from '../screens/SolusLibrary';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="SolusLibrary" component={SolusLibrary} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

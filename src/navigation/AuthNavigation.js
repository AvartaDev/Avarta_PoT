import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Landing from '../screens/Landing';
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
      {/* <Stack.Screen name="SolusLibrary" component={SolusLibrary} /> */}
      <Stack.Screen name="landing" component={Landing} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

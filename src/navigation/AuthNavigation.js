import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '@screens/Auth/Login';
import Register from '@screens/Auth/Register';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

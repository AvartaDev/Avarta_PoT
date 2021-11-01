import React, { useEffect, useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '@screens/Auth/Login';
import Register from '@screens/Auth/Register';
import SolusLibrary from '../screens/SolusLibrary';
import * as FileSystem from 'expo-file-system'
import { Text } from 'react-native-elements';
const Stack = createStackNavigator();

const AuthNavigator = () => {

  const [isFirstTime, setFirstTime] = useState()
  const [isLoaded, setLoaded] = useState(false)
  const fileName = "file://initialLaunch"
  
  const checkFirstTime = async () => {
    //check if file exists
    // const tmp = await FileSystem.getInfoAsync(fileName)
    // setFirstTime(tmp.exists)
    // setFirstTime(true)
    // if(!tmp.exists)
    //   FileSystem.writeAsStringAsync(fileName, "junk")
    setLoaded(true)
  }

  useEffect( async ()=>{
    await checkFirstTime();
    console.log(isFirstTime)
  }, [])

  if(!isLoaded)
    return(<Text data={"LOADING"}/>)
  else 
    return (
      <Stack.Navigator
        // initialRouteName={isFirstTime ? 'SolusLibrary' : 'Login'}
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="SolusLibrary" component={SolusLibrary} />
      </Stack.Navigator>
    );
};

export default AuthNavigator;

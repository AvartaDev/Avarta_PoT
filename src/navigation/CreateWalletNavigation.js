import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateMain from '@screens/wallet/create/CreateMain'
import CreateViewDetails from '@screens/wallet/create/CreateViewDetails';

const Stack = createStackNavigator();

const CreateWalletNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="createwalletscreen" component={CreateMain} />
            <Stack.Screen name="createviewdetails" component={CreateViewDetails} />
        </Stack.Navigator>
    );
};

export default CreateWalletNavigation;

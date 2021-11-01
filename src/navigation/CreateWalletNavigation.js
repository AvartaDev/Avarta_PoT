import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateWalletMainScreen from '@screens/wallet/create/CreateWalletMainScreen'
import CreateWalletDetailsScreen from '@screens/wallet/create/CreateWalletDetailsScreen';
import { CREATE_WALLET_DETAILS, CREATE_WALLET_MAIN } from '@constants/navigation';

const Stack = createStackNavigator();

const CreateWalletNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName={CREATE_WALLET_MAIN}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name={CREATE_WALLET_MAIN} component={CreateWalletMainScreen} />
            <Stack.Screen name={CREATE_WALLET_DETAILS} component={CreateWalletDetailsScreen} />
        </Stack.Navigator>
    );
};

export default CreateWalletNavigation;

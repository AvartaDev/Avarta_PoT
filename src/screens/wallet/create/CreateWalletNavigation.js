import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateTokenWalletMain from '@screens/wallet/create/CreateTokenWalletMain'
import CreateTokenWalletDetails from '@screens/wallet/create/CreateTokenWalletDetails';
import { CREATE_WALLET_DETAILS, CREATE_WALLET_MAIN } from '@constants/navigation';

const Stack = createStackNavigator();

const CreateWalletNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName={CREATE_WALLET_MAIN}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name={CREATE_WALLET_MAIN} component={CreateTokenWalletMain} />
            <Stack.Screen name={CREATE_WALLET_DETAILS} component={CreateTokenWalletDetails} />
        </Stack.Navigator>
    );
};

export default CreateWalletNavigation;

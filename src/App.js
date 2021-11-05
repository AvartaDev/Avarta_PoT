import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {Provider as WalletProvider} from './store/WalletStore';
import {Provider as AlertProvider} from './store/AlertStore';
import {Provider as AuthProvider} from './store/AuthStore';
import {Provider} from '@hooks/useTheme';
import Theme from '@libs/Theme';
import AppNavigator from '@navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import '../shim.js';

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <AlertProvider>
          <AuthProvider>
            <WalletProvider>
              <StatusBar
                barStyle="dark-content"
                setNetworkActivityIndicatorVisible
              />
              <AppNavigator />
              <Toast/>
            </WalletProvider>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

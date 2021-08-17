import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {Provider as WalletProvider} from './store/WalletStore';
import {Provider as AlertProvider} from './store/AlertStore';
import {Provider} from '@hooks/useTheme';
import Theme from '@libs/Theme';
import AppNavigator from '@navigation/AppNavigator';

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <AlertProvider>
          <WalletProvider>
            <StatusBar
              barStyle="dark-content"
              setNetworkActivityIndicatorVisible
            />
            <AppNavigator />
          </WalletProvider>
        </AlertProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

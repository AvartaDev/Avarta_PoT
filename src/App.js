import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {Provider} from '@hooks/useTheme';
import Theme from '@libs/Theme';
import AppNavigator from '@navigation/AppNavigator';

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <StatusBar barStyle="dark-content" setNetworkActivityIndicatorVisible />
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App.js';
import {name as appName} from './app.json';
import 'react-native-url-polyfill/auto';
import 'fastestsmallesttextencoderdecoder';
AppRegistry.registerComponent(appName, () => App);

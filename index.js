/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();

AppRegistry.registerComponent(appName, () => App);

/**
 * Job Search Tracker App
 * A React Native app for tracking job applications
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { HomeView } from './src/views';

import JobListScreen from './src/screens/JobListScreen';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <JobListScreen />
    </SafeAreaProvider>
  );
}


export default App;

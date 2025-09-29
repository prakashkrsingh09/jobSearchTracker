import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import JobListScreen from './src/screens/JobListScreen';
import { SplashScreen } from './src/components';
import { SplashConfigurations } from './src/config/splashConfig';
import AuthEmailScreen from './src/screens/AuthEmailScreen';
import { firebaseAuth } from './src/firebase/config';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SplashScreen
        onFinish={handleSplashFinish}
        {...SplashConfigurations.withLogo}
        // {...SplashConfigurations.default} - No custom images
        // {...SplashConfigurations.withBackground} - With background image
        // {...SplashConfigurations.fullCustom} - With both logo and background
        // {...SplashConfigurations.minimal} - Minimal design
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {user ? <JobListScreen /> : <AuthEmailScreen />}
    </SafeAreaProvider>
  );
}

export default App;

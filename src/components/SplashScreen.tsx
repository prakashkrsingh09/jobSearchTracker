import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
  logoImage?: any;
  backgroundImage?: any;
  appName?: string;
  tagline?: string;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 3000,
  logoImage,
  backgroundImage,
  appName = 'Job Search Tracker',
  tagline = 'Synchronizes your job search efforts',
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));
  const [dotAnim1] = useState(new Animated.Value(0.3));
  const [dotAnim2] = useState(new Animated.Value(0.3));
  const [dotAnim3] = useState(new Animated.Value(0.3));

  useEffect(() => {
    // Start main animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate loading dots
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dotAnim1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim1, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim2, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim3, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Repeat animation
        setTimeout(animateDots, 500);
      });
    };

    // Start dot animation after main animations
    setTimeout(animateDots, 1200);

    // Auto finish after duration
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish, fadeAnim, scaleAnim, slideAnim, dotAnim1, dotAnim2, dotAnim3]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Background Image */}
      {backgroundImage && (
        <Image source={backgroundImage} style={styles.backgroundImage} />
      )}
      
      {/* Gradient Overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {logoImage ? (
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={styles.defaultLogo}>
              <Text style={styles.defaultLogoText}>📱</Text>
            </View>
          )}
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: dotAnim1 }]} />
            <Animated.View style={[styles.dot, { opacity: dotAnim2 }]} />
            <Animated.View style={[styles.dot, { opacity: dotAnim3 }]} />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(26, 26, 46, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  defaultLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f3460',
  },
  defaultLogoText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f3460',
    marginHorizontal: 4,
  },
});

export default SplashScreen;

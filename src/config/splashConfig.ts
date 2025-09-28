export const SplashConfigurations = {
  // Default configuration (no custom images)
  default: {
    appName: 'Job Search Tracker',
    tagline: 'Track your career journey',
    duration: 3000,
  },

  // Configuration with logo image
  withLogo: {
    appName: 'Job Search Tracker',
    tagline: 'Track your career journey',
    duration: 3000,
    logoImage: require('../assets/splash/splash_logo.png'), // Using your existing screenshot as logo
  },

  // Configuration with background image
  withBackground: {
    appName: 'Job Search Tracker',
    tagline: 'Track your career journey',
    duration: 3000,
    backgroundImage: require('../screenshots/AddNewJobDetails.png'), // Using your existing screenshot as background
  },

  // Configuration with both logo and background
  fullCustom: {
    appName: 'Job Search Tracker',
    tagline: 'Track your career journey',
    duration: 3000,
    logoImage: require('../screenshots/Main.png'),
    backgroundImage: require('../screenshots/AddNewJobDetails.png'),
  },

  // Minimal configuration
  minimal: {
    appName: 'Job Tracker',
    tagline: 'Your career companion',
    duration: 2000,
  },
};

/*
<SplashScreen
  onFinish={handleSplashFinish}
  {...SplashConfigurations.default}
/>
*/

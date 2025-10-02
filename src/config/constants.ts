// Configuration constants - fallback if environment variables don't work
export const CONFIG = {
  // Google Sheets Configuration
  GOOGLE_SHEETS_API_KEY: 'AIzaSyBdZzy0Y0vNdmOvoBYKMBBwKE6IfcuoV1w',
  GOOGLE_SHEETS_ID: '1nJrE4-MVRtu0dVG5YxowHdIjNxKyBxaattA3LE_2n5Q',
  GOOGLE_SHEETS_NAME: 'Sheet2',
  
  // API Configuration
  API_BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
  API_TIMEOUT: 10000,
  
  // App Configuration
  APP_NAME: 'Interview Sync',
  APP_VERSION: '1.0.0',
};

// Try to use environment variables if available, otherwise fallback to constants
export const getConfig = () => {
  try {
    // This will work if @env is properly configured
    const env = require('@env');
    const config = {
      GOOGLE_SHEETS_API_KEY: env.GOOGLE_SHEETS_API_KEY || CONFIG.GOOGLE_SHEETS_API_KEY,
      GOOGLE_SHEETS_ID: env.GOOGLE_SHEETS_ID || CONFIG.GOOGLE_SHEETS_ID,
      GOOGLE_SHEETS_NAME: env.GOOGLE_SHEETS_NAME || CONFIG.GOOGLE_SHEETS_NAME,
      API_BASE_URL: env.API_BASE_URL || CONFIG.API_BASE_URL,
      API_TIMEOUT: parseInt(env.API_TIMEOUT) || CONFIG.API_TIMEOUT,
      APP_NAME: env.APP_NAME || CONFIG.APP_NAME,
      APP_VERSION: env.APP_VERSION || CONFIG.APP_VERSION,
    };
    console.log('Configuration loaded from environment variables:', config);
    return config;
  } catch (error) {
    console.log('Environment variables not available, using fallback constants');
    console.log('Fallback config:', CONFIG);
    return CONFIG;
  }
};

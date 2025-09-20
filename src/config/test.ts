// Test file to verify configuration is working
import { getConfig } from './constants';

export const testConfig = () => {
  const config = getConfig();
  console.log('Configuration loaded successfully:');
  console.log('API Base URL:', config.API_BASE_URL);
  console.log('Sheet ID:', config.GOOGLE_SHEETS_ID);
  console.log('Sheet Name:', config.GOOGLE_SHEETS_NAME);
  console.log('API Timeout:', config.API_TIMEOUT);
  return config;
};

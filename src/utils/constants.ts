// App constants
export const APP_CONFIG = {
  NAME: 'Job Search Tracker',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
};

// API endpoints
export const API_ENDPOINTS = {
  GOOGLE_SHEETS_BASE: 'https://sheets.googleapis.com/v4/spreadsheets',
};

// Colors
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#F2F2F7',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#6D6D70',
  BORDER: '#C6C6C8',
};

// Dimensions
export const DIMENSIONS = {
  BORDER_RADIUS: 8,
  PADDING_SMALL: 8,
  PADDING_MEDIUM: 16,
  PADDING_LARGE: 24,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 16,
  MARGIN_LARGE: 24,
};

// Job application statuses
export const JOB_STATUSES = [
  'Applied',
  'Interview',
  'Rejected',
  'Offered',
  'Withdrawn',
] as const;

export type JobStatus = typeof JOB_STATUSES[number];

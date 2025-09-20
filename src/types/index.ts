// Common types used throughout the app

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offered' | 'Withdrawn';
  location: string;
  salary?: string;
  notes?: string;
  source: string; // LinkedIn, Indeed, Company Website, etc.
}

export interface SheetRow {
  id: number;
  data: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  JobDetails: { jobId: string };
  AddJob: undefined;
  Settings: undefined;
};

// Component props types
export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

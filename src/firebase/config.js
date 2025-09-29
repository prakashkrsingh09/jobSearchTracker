import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Initialize Firestore instance
export const db = firestore();

// Collection reference for jobs
export const jobsCollection = db.collection('jobs');

// Firebase Auth instance
export const firebaseAuth = auth();

// Helper functions to get user-specific collections
export const authInstance = firebaseAuth;

export const getCurrentUser = () => {
  return authInstance.currentUser;
};

export const getUserDocument = (userId = null) => {
  const uid = userId || getCurrentUser()?.uid;
  if (!uid) throw new Error('User not authenticated');
  return db.collection('users').doc(uid);
};

export const getUserJobsCollection = (userId = null) => {
  return getUserDocument(userId).collection('jobs');
};

export const getUserSettings = (userId = null) => {
  return getUserDocument(userId).collection('settings');
};

export default db;



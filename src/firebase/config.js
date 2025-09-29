import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Initialize Firestore instance
export const db = firestore();

// Collection reference for jobs
export const jobsCollection = db.collection('jobs');

// Firebase Auth instance
export const firebaseAuth = auth();

export default db;



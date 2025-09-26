import firestore from '@react-native-firebase/firestore';

// Initialize Firestore instance
export const db = firestore();

// Collection reference for jobs
export const jobsCollection = db.collection('jobs');

export default db;



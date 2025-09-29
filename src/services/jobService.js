import { getUserJobsCollection, getCurrentUser } from '../firebase/config';
import firestore from '@react-native-firebase/firestore';

// Add new job application
export const addJobApplication = async (jobData) => {
  try {
    const userJobsCollection = getUserJobsCollection();
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    const docRef = await userJobsCollection.add({
      ...jobData,
      user_id: currentUser.uid,
      created_at: firestore.FieldValue.serverTimestamp(),
      updated_at: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

// Get all job applications
export const getJobApplications = async () => {
  try {
    const userJobsCollection = getUserJobsCollection();
    const snapshot = await userJobsCollection.orderBy('created_at', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

// Update job application
export const updateJobApplication = async (jobId, changes) => {
  try {
    const userJobsCollection = getUserJobsCollection();
    // Handle both old format (object) and new format (changes array)
    if (Array.isArray(changes)) {
      // New format: array of changes with field, previousValue, newValue
      const updateData = {};
      
      changes.forEach(change => {
        updateData[change.field] = change.newValue;
      });
      
      // Add updated_at timestamp
      updateData.updated_at = firestore.FieldValue.serverTimestamp();
      
      console.log('Updating job with data:', updateData);
      await userJobsCollection.doc(jobId).update(updateData);
    } else {
      // Old format: direct object update (for backward compatibility)
      const updateData = {
        ...changes,
        updated_at: firestore.FieldValue.serverTimestamp()
      };
      
      console.log('Updating job with data:', updateData);
      await userJobsCollection.doc(jobId).update(updateData);
    }
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete job application
export const deleteJobApplication = async (jobId) => {
  try {
    const userJobsCollection = getUserJobsCollection();
    await userJobsCollection.doc(jobId).delete();
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};
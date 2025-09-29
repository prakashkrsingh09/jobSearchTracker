import { getUserDocument, getCurrentUser } from '../firebase/config';
import firestore from '@react-native-firebase/firestore';

export const createUserProfile = async (userData) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const userDoc = getUserDocument(user.uid);

    await userDoc.set({
      uid: user.uid,
      email: user.email,
      ...userData,
      created_at: firestore.FieldValue.serverTimestamp(),
      updated_at: firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return user.uid;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const userDoc = getUserDocument(user.uid);
    const doc = await userDoc.get();

    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      await createUserProfile({ email: user.email });
      return { id: user.uid, email: user.email };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const userDoc = getUserDocument(user.uid);

    await userDoc.update({
      ...updates,
      updated_at: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const deleteAllUserData = async (userId) => {
  try {
    const userDoc = getUserDocument(userId);

    const jobsSnapshot = await userDoc.collection('jobs').get();
    const jobsDeletePromises = jobsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(jobsDeletePromises);

    const settingsSnapshot = await userDoc.collection('settings').get();
    const settingsDeletePromises = settingsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(settingsDeletePromises);

    await userDoc.delete();
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    await deleteAllUserData(user.uid);

    await user.delete();

    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

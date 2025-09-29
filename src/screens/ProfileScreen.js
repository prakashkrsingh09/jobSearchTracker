import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { getJobApplications } from '../services/jobService';
import { firebaseAuth } from '../firebase/config';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const [userData, jobs] = await Promise.all([
        getUserProfile(),
        getJobApplications(),
      ]);
      setUser(userData);
      const interviewedCount = jobs.filter(job => (
        job?.interview_1st_round === 'completed' || job?.interview_2nd_round === 'completed'
      )).length;
      const offersCount = jobs.filter(job => job?.offer_status === 'accepted').length;
      setStats({
        total: jobs.length,
        applied: jobs.filter(job => job?.job_status === 'applied').length,
        interviewed: interviewedCount,
        offers: offersCount,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      Alert.alert('Sign Out Failed', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.userInfo}>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.name}>{user?.name || 'No name set'}</Text>
        <Text style={styles.memberSince}>
          Member since: {user?.created_at?.toDate?.().toLocaleDateString?.() || '—'}
        </Text>
      </View>

      {stats && (
        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Job Application Stats</Text>
          <View style={styles.statRow}>
            <Text>Total Applications: {stats.total}</Text>
          </View>
          <View style={styles.statRow}>
            <Text>Applied: {stats.applied}</Text>
          </View>
          <View style={styles.statRow}>
            <Text>Interviews: {stats.interviewed}</Text>
          </View>
          <View style={styles.statRow}>
            <Text>Offers: {stats.offers}</Text>
          </View>
        </View>
      )}

      <Button title="Sign Out" onPress={handleSignOut} color="#FF3B30" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userInfo: { marginBottom: 30, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 },
  email: { fontSize: 18, fontWeight: 'bold' },
  name: { fontSize: 16, color: '#666' },
  memberSince: { fontSize: 14, color: '#888', marginTop: 5 },
  stats: { marginBottom: 30, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 8 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statRow: { paddingVertical: 5 },
});

export default ProfileScreen;



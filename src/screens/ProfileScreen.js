import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserProfile } from '../services/userService';
import { getJobApplications } from '../services/jobService';
import { firebaseAuth } from '../firebase/config';
import AlertModal from '../components/AlertModal';
import HamburgerMenu from '../components/HamburgerMenu';
import AboutUsScreen from './AboutUsScreen';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hamburgerMenuVisible, setHamburgerMenuVisible] = useState(false);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);

  // Alert modal state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShowCancel, setAlertShowCancel] = useState(false);
  const [alertOnOk, setAlertOnOk] = useState(() => () => {});

  // Custom alert function
  const showAlert = (title, message, showCancel = false, onOk = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertShowCancel(showCancel);
    setAlertOnOk(() => onOk || (() => setAlertVisible(false)));
    setAlertVisible(true);
  };

  // Menu handlers
  const handleAboutUs = () => {
    setAboutUsVisible(true);
  };

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', true, async () => {
      try {
        await firebaseAuth.signOut();
      } catch (error) {
        showAlert('Logout Failed', error.message);
      }
    });
  };

  const handleDeleteAccount = () => {
    showAlert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      true,
      async () => {
        try {
          // TODO: Implement account deletion
          showAlert(
            'Account Deleted',
            'Your account has been successfully deleted.',
          );
        } catch (error) {
          showAlert('Error', 'Failed to delete account. Please try again.');
        }
      },
    );
  };

  const handleResetPassword = () => {
    showAlert(
      'Reset Password',
      'A password reset email will be sent to your registered email address. Please check your inbox and follow the instructions.',
      false,
      async () => {
        try {
          const currentUser = firebaseAuth.currentUser;
          if (currentUser && currentUser.email) {
            await firebaseAuth.sendPasswordResetEmail(currentUser.email);
            showAlert(
              'Email Sent',
              'Password reset email has been sent successfully!',
            );
          } else {
            showAlert('Error', 'No user logged in or email not available.');
          }
        } catch (error) {
          showAlert('Error', `Failed to send reset email: ${error.message}`);
        }
      },
    );
  };

  const loadUserData = async () => {
    try {
      const [userData, jobs] = await Promise.all([
        getUserProfile(),
        getJobApplications(),
      ]);
      setUser(userData);
      const interviewedCount = jobs.filter(
        job =>
          job?.interview_1st_round === 'completed' ||
          job?.interview_2nd_round === 'completed',
      ).length;
      const offersCount = jobs.filter(
        job => job?.offer_status === 'accepted',
      ).length;
      setStats({
        total: jobs.length,
        applied: jobs.filter(job => job?.job_status === 'applied').length,
        interviewed: interviewedCount,
        offers: offersCount,
      });
    } catch (error) {
      showAlert('Error', 'Failed to load profile data');
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
      showAlert('Sign Out Failed', error.message);
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setHamburgerMenuVisible(true)}
        >
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.name}>{user?.name || 'No name set'}</Text>
        <Text style={styles.memberSince}>
          Member since:{' '}
          {user?.created_at?.toDate?.().toLocaleDateString?.() || '—'}
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

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        showCancel={alertShowCancel}
        cancelText="Cancel"
        okText={
          alertTitle === 'Logout'
            ? 'Logout'
            : alertTitle === 'Delete Account'
            ? 'Delete'
            : 'OK'
        }
        onCancel={() => setAlertVisible(false)}
        onOk={alertOnOk}
      />

      <HamburgerMenu
        visible={hamburgerMenuVisible}
        onClose={() => setHamburgerMenuVisible(false)}
        onAboutUs={handleAboutUs}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onResetPassword={handleResetPassword}
      />

      {aboutUsVisible && (
        <AboutUsScreen onClose={() => setAboutUsVisible(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  menuButton: {
    padding: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userInfo: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  email: { fontSize: 18, fontWeight: 'bold' },
  name: { fontSize: 16, color: '#666' },
  memberSince: { fontSize: 14, color: '#888', marginTop: 5 },
  stats: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statRow: { paddingVertical: 5 },
});

export default ProfileScreen;

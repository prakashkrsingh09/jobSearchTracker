import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  deleteJobApplication,
  getJobApplications,
  updateJobApplication,
  addJobApplication,
} from '../services/jobService';
import { EditJobModal, AddJobModal } from '../components';

const JobListScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const loadJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const jobList = await getJobApplications();
      console.log('jobList : ', jobList);
      setJobs(jobList);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadJobs(true);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              animating={true}
              hidesWhenStopped={true}
              style={styles.loadingText}
              color={'#007AFF'}
            />
            {/* <Text style={styles.loadingText}>📋</Text> */}
            <Text style={styles.loadingTitle}>Loading Job Applications</Text>
            <Text style={styles.loadingSubtitle}>
              Please wait while we fetch your data...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }


  const handleRowDelete = async jobId => {
    Alert.alert(
      'Delete Job Application',
      'Are you sure you want to delete this job application? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting job ID:', jobId);
              await deleteJobApplication(jobId);
              console.log('Job deleted successfully');

              // Reload jobs after deletion
              await loadJobs();
            } catch (rowDeleteError) {
              console.error('❌ Error deleting row:', rowDeleteError);
              Alert.alert(
                'Error',
                'Failed to delete job application. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const handleEditJob = job => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleModalSave = async (jobId, changes) => {
    try {

      await updateJobApplication(jobId, changes);
      // Reload jobs after update
      await loadJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    } finally {
      setModalVisible(false);
      setSelectedJob(null);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleAddJob = () => {
    setAddModalVisible(true);
  };

  const handleAddJobSave = async jobData => {
    try {
      await addJobApplication(jobData);
      await loadJobs();
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error;
    } finally {
      setAddModalVisible(false);
    }
  };

  const handleAddJobCancel = () => {
    setAddModalVisible(false);
  };

  const getStatusStyle = status => {
    // Handle different data types - convert to string safely
    let statusString = '';
    if (typeof status === 'string') {
      statusString = status;
    } else if (typeof status === 'object' && status !== null) {
      // Handle Firestore objects or other objects
      statusString = status.toString();
    } else if (status !== null && status !== undefined) {
      statusString = String(status);
    }

    const statusLower = statusString.toLowerCase();

    if (
      statusLower.includes('interview') ||
      statusLower.includes('scheduled')
    ) {
      return styles.statusInterview;
    } else if (
      statusLower.includes('offer') ||
      statusLower.includes('accepted')
    ) {
      return styles.statusOffer;
    } else if (
      statusLower.includes('rejected') ||
      statusLower.includes('declined')
    ) {
      return styles.statusRejected;
    } else if (
      statusLower.includes('applied') ||
      statusLower.includes('pending')
    ) {
      return styles.statusApplied;
    } else {
      return styles.statusDefault;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Job Applications</Text>
          <Text style={styles.headerSubtitle}>
            {jobs.length} applications tracked
          </Text>
        </View>
        <TouchableOpacity style={styles.addButtonHeader} onPress={handleAddJob}>
          <Text style={styles.addButtonHeaderText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Job List */}
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.jobCard}>
              <View style={styles.jobCardHeader}>
                <View style={styles.jobInfo}>
                  <Text style={styles.companyName}>
                    {item.company_name || 'Company Name Not Provided'}
                  </Text>
                  <Text style={styles.jobTitle}>
                    {item.job_title || 'Job Title Not Provided'}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        getStatusStyle(item.job_application_status),
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {typeof item.job_application_status === 'string'
                          ? item.job_application_status
                          : item.job_application_status?.toString() ||
                            'Applied'}
                      </Text>
                    </View>
                    <Text style={styles.locationText}>
                      📍 {item.job_location || 'Location Not Specified'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditJob(item)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleRowDelete(item.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Job Details */}
              <View style={styles.jobDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applied:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      !item.applied_date && styles.placeholderText,
                    ]}
                  >
                    {item.applied_date
                      ? item.applied_date._seconds
                        ? new Date(
                            item.applied_date._seconds * 1000,
                          ).toLocaleDateString()
                        : item.applied_date
                      : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>HR Contact:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      !item.hr_name && styles.placeholderText,
                    ]}
                  >
                    {item.hr_name || 'Not provided'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Platform:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      !item.application_platform && styles.placeholderText,
                    ]}
                  >
                    {item.application_platform || 'Not specified'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Referred By:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      !item.referred_by && styles.placeholderText,
                    ]}
                  >
                    {item.referred_by || 'Not specified'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Salary:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      !item.salary_offered && styles.placeholderText,
                    ]}
                  >
                    {item.salary_offered || 'Not disclosed'}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Modals */}
      <EditJobModal
        visible={modalVisible}
        jobData={selectedJob}
        onSave={handleModalSave}
        onCancel={handleModalCancel}
      />

      <AddJobModal
        visible={addModalVisible}
        onSave={handleAddJobSave}
        onCancel={handleAddJobCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  addButtonHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonHeaderText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusApplied: {
    backgroundColor: '#007AFF',
  },
  statusInterview: {
    backgroundColor: '#FF9500',
  },
  statusOffer: {
    backgroundColor: '#34C759',
  },
  statusRejected: {
    backgroundColor: '#FF3B30',
  },
  statusDefault: {
    backgroundColor: '#8E8E93',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#fed7d7',
  },
  actionButtonText: {
    fontSize: 16,
  },
  jobDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default JobListScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface JobData {
  company_name: string;
  job_title: string;
  job_location: string;
  referred_by: string;
  application_platform: string;
  job_application_status: string;
  job_status: string;
  hr_name: string;
  hr_phone_number: string;
  applied_date: string;
  interview_1st_round: string;
  interview_2nd_round: string;
  interview_3rd_round: string;
  interview_4th_round: string;
  offer_status: string;
  salary_offered: string;
  feedback: string;
  notes: string;
}

interface AddJobModalProps {
  visible: boolean;
  onSave: (jobData: JobData) => Promise<void>;
  onCancel: () => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({
  visible,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JobData>({
    company_name: '',
    job_title: '',
    job_location: '',
    referred_by: '',
    application_platform: '',
    job_application_status: '',
    job_status: '',
    hr_name: '',
    hr_phone_number: '',
    applied_date: '',
    interview_1st_round: '',
    interview_2nd_round: '',
    interview_3rd_round: '',
    interview_4th_round: '',
    offer_status: '',
    salary_offered: '',
    feedback: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.company_name.trim()) {
        Alert.alert('Validation Error', 'Company name is required');
        return;
      }
      if (!formData.job_title.trim()) {
        Alert.alert('Validation Error', 'Job title is required');
        return;
      }

      setIsLoading(true);
      await onSave(formData);
      
      // Reset form after successful save
      setFormData({
        company_name: '',
        job_title: '',
        job_location: '',
        referred_by: '',
        application_platform: '',
        job_application_status: '',
        job_status: '',
        hr_name: '',
        hr_phone_number: '',
        applied_date: '',
        interview_1st_round: '',
        interview_2nd_round: '',
        interview_3rd_round: '',
        interview_4th_round: '',
        offer_status: '',
        salary_offered: '',
        feedback: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', 'Failed to save job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      company_name: '',
      job_title: '',
      job_location: '',
      referred_by: '',
      application_platform: '',
      job_application_status: '',
      job_status: '',
      hr_name: '',
      hr_phone_number: '',
      applied_date: '',
      interview_1st_round: '',
      interview_2nd_round: '',
      interview_3rd_round: '',
      interview_4th_round: '',
      offer_status: '',
      salary_offered: '',
      feedback: '',
      notes: '',
    });
    onCancel();
  };

  const updateField = (field: keyof JobData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fields = [
    { key: 'company_name', label: 'Company Name *', placeholder: 'Enter company name', required: true },
    { key: 'job_title', label: 'Job Title *', placeholder: 'Enter job title', required: true },
    { key: 'job_location', label: 'Job Location', placeholder: 'Enter job location' },
    { key: 'referred_by', label: 'Referred By', placeholder: 'Enter referral source' },
    { key: 'application_platform', label: 'Application Platform', placeholder: 'e.g., LinkedIn, Indeed' },
    { key: 'job_application_status', label: 'Application Status', placeholder: 'e.g., Applied, In Review' },
    { key: 'job_status', label: 'Job Status', placeholder: 'e.g., Active, Closed' },
    { key: 'hr_name', label: 'HR Name', placeholder: 'Enter HR contact name' },
    { key: 'hr_phone_number', label: 'HR Phone', placeholder: 'Enter HR phone number' },
    { key: 'applied_date', label: 'Applied Date', placeholder: 'YYYY-MM-DD' },
    { key: 'interview_1st_round', label: '1st Round Interview', placeholder: 'Date or status' },
    { key: 'interview_2nd_round', label: '2nd Round Interview', placeholder: 'Date or status' },
    { key: 'interview_3rd_round', label: '3rd Round Interview', placeholder: 'Date or status' },
    { key: 'interview_4th_round', label: '4th Round Interview', placeholder: 'Date or status' },
    { key: 'offer_status', label: 'Offer Status', placeholder: 'e.g., Pending, Accepted, Rejected' },
    { key: 'salary_offered', label: 'Salary Offered', placeholder: 'Enter salary amount' },
    { key: 'feedback', label: 'Feedback', placeholder: 'Enter any feedback received' },
    { key: 'notes', label: 'Notes', placeholder: 'Additional notes' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Job Application</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <View style={styles.form}>
            {fields.map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  {field.label}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    field.required && !formData[field.key as keyof JobData] && styles.requiredField
                  ]}
                  value={formData[field.key as keyof JobData] as string}
                  onChangeText={(value) => updateField(field.key as keyof JobData, value)}
                  placeholder={field.placeholder}
                  multiline={field.key === 'feedback' || field.key === 'notes'}
                  numberOfLines={field.key === 'feedback' || field.key === 'notes' ? 3 : 1}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelBtn]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveBtn]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveBtnText}>
              {isLoading ? 'Saving...' : 'Add Job'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0056b3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 44,
  },
  requiredField: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddJobModal;

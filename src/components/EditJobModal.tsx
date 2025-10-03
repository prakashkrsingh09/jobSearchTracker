import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AlertModal from './AlertModal';

interface JobData {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
  interview_1st_round: string;
  interview_2nd_round: string;
  interview_3rd_round: string;
  interview_4th_round: string;
  offer_status: string;
  salary_offered: string;
  feedback: string;
  notes: string;
}

interface FieldChange {
  field: string;
  previousValue: string;
  newValue: string;
}

interface EditJobModalProps {
  visible: boolean;
  jobData: JobData | null;
  onSave: (id: string, changes: FieldChange[]) => Promise<void>;
  onCancel: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  visible,
  jobData,
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
  const [originalData, setOriginalData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Alert modal state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShowCancel, setAlertShowCancel] = useState(false);
  const [alertOnOk, setAlertOnOk] = useState(() => () => {});

  // Custom alert function
  const showAlert = (title: string, message: string, showCancel = false, onOk = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertShowCancel(showCancel);
    setAlertOnOk(() => onOk || (() => setAlertVisible(false)));
    setAlertVisible(true);
  };

  // Update form data when jobData changes
  useEffect(() => {
    if (jobData) {
      const normalizedData = {
        ...jobData,
        // Ensure all fields are strings
        company_name: jobData.company_name || '',
        job_title: jobData.job_title || '',
        job_location: jobData.job_location || '',
        referred_by: jobData.referred_by || '',
        application_platform: jobData.application_platform || '',
        job_application_status: jobData.job_application_status || '',
        job_status: jobData.job_status || '',
        hr_name: jobData.hr_name || '',
        hr_phone_number: jobData.hr_phone_number || '',
        applied_date: jobData.applied_date || '',
        interview_1st_round: jobData.interview_1st_round || '',
        interview_2nd_round: jobData.interview_2nd_round || '',
        interview_3rd_round: jobData.interview_3rd_round || '',
        interview_4th_round: jobData.interview_4th_round || '',
        offer_status: jobData.offer_status || '',
        salary_offered: jobData.salary_offered || '',
        feedback: jobData.feedback || '',
        notes: jobData.notes || '',
      };
      setFormData(normalizedData);
      setOriginalData(normalizedData);
    }
  }, [jobData]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (!originalData || !originalData.id) {
        throw new Error('No original data or ID found');
      }

      // Track changes between original and current data
      const changes: FieldChange[] = [];
      const fieldsToCheck: (keyof JobData)[] = [
        'company_name', 'job_title', 'job_location', 'referred_by',
        'application_platform', 'job_application_status', 'job_status',
        'hr_name', 'hr_phone_number', 'applied_date', 'interview_1st_round',
        'interview_2nd_round', 'interview_3rd_round', 'interview_4th_round',
        'offer_status', 'salary_offered', 'feedback', 'notes'
      ];

      fieldsToCheck.forEach(field => {
        const originalValue = originalData[field] || '';
        const newValue = formData[field] || '';
        
        if (originalValue !== newValue) {
          changes.push({
            field: field as string,
            previousValue: originalValue,
            newValue: newValue
          });
        }
      });

      console.log('Changes detected:', changes);
      await onSave(originalData.id, changes);
    } catch (error) {
      console.error('Error saving job:', error);
      showAlert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const updateField = (field: keyof JobData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fields = [
    { key: 'company_name', label: 'Company Name', placeholder: 'Enter company name' },
    { key: 'job_title', label: 'Job Title', placeholder: 'Enter job title' },
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
          <Text style={styles.title}>Edit Job Application</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <View style={styles.form}>
            {fields.map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.textInput}
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
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        showCancel={alertShowCancel}
        onCancel={() => setAlertVisible(false)}
        onOk={alertOnOk}
      />
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
    backgroundColor: '#351c75',
    borderBottomWidth: 1,
    borderBottomColor: '#2a1458',
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

export default EditJobModal;

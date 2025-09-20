import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { JobApplicationForm } from '../services/jobApplicationService';
import { JOB_STATUSES } from '../utils/constants';

interface AddJobFormProps {
  onSubmit: (application: JobApplicationForm) => Promise<void>;
  onCancel: () => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<JobApplicationForm>({
    company: '',
    position: '',
    appliedDate: new Date().toISOString().split('T')[0], // Today's date
    status: 'Applied',
    location: '',
    salary: '',
    notes: '',
    source: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.company.trim() || !formData.position.trim()) {
      Alert.alert('Error', 'Please fill in Company and Position fields');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      Alert.alert('Success', 'Job application added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add job application. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof JobApplicationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Add New Job Application</Text>

        {/* Company */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company *</Text>
          <TextInput
            style={styles.input}
            value={formData.company}
            onChangeText={(value) => updateField('company', value)}
            placeholder="Enter company name"
            autoCapitalize="words"
          />
        </View>

        {/* Position */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Position *</Text>
          <TextInput
            style={styles.input}
            value={formData.position}
            onChangeText={(value) => updateField('position', value)}
            placeholder="Enter job position"
            autoCapitalize="words"
          />
        </View>

        {/* Applied Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Applied Date</Text>
          <TextInput
            style={styles.input}
            value={formData.appliedDate}
            onChangeText={(value) => updateField('appliedDate', value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {JOB_STATUSES.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  formData.status === status && styles.statusButtonActive,
                ]}
                onPress={() => updateField('status', status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => updateField('location', value)}
            placeholder="Enter job location"
            autoCapitalize="words"
          />
        </View>

        {/* Salary */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salary</Text>
          <TextInput
            style={styles.input}
            value={formData.salary}
            onChangeText={(value) => updateField('salary', value)}
            placeholder="Enter salary range"
            keyboardType="numeric"
          />
        </View>

        {/* Source */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.input}
            value={formData.source}
            onChangeText={(value) => updateField('source', value)}
            placeholder="LinkedIn, Indeed, Company Website, etc."
            autoCapitalize="words"
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => updateField('notes', value)}
            placeholder="Additional notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Application'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddJobForm;

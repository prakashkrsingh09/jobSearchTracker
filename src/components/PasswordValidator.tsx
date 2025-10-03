import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PasswordValidatorProps {
  password: string;
  visible?: boolean;
}

const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password, visible = true }) => {
  if (!visible || !password) return null;

  const validations = [
    {
      text: 'At least 6 characters',
      isValid: password.length >= 6,
    },
    {
      text: 'Contains at least one letter',
      isValid: /(?=.*[A-Za-z])/.test(password),
    },
    {
      text: 'Contains at least one number',
      isValid: /(?=.*\d)/.test(password),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Requirements:</Text>
      {validations.map((validation, index) => (
        <View key={index} style={styles.validationRow}>
          <Icon
            name={validation.isValid ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={validation.isValid ? '#4CAF50' : '#F44336'}
            style={styles.icon}
          />
          <Text style={[
            styles.validationText,
            validation.isValid ? styles.validText : styles.invalidText
          ]}>
            {validation.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  validationText: {
    fontSize: 13,
    flex: 1,
  },
  validText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  invalidText: {
    color: '#F44336',
  },
});

export default PasswordValidator;

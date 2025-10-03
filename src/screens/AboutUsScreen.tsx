import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AboutUsScreenProps {
  onClose: () => void;
}

const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Interview Sync</Text>
          <Text style={styles.version}>Version 1.0.1</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            Interview Sync helps job seekers track their applications, manage interviews, 
            and stay organized throughout their job search journey. We believe that staying 
            organized and informed is key to landing your dream job.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Track job applications</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Schedule interview reminders</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Store company information</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Track application status</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Secure data storage</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
            Have questions or feedback? We'd love to hear from you!
          </Text>
          <View style={styles.contactItem}>
            <Icon name="mail-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>interviewssync@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="globe-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>https://prakashkrsingh09.wordpress.com</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Terms</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. All your data is securely stored and 
            encrypted. We never share your personal information with third parties.
          </Text>
          <TouchableOpacity
          onPress={() => Linking.openURL('https://prakashkrsingh09.wordpress.com/privacy-policy/')}
          >
          <Text style={[styles.sectionText,{color: '#007AFF'}]}>
            Privacy Policy
          </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Interview Sync. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default AboutUsScreen;

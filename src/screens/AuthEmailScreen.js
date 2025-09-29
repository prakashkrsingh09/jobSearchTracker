import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { firebaseAuth } from '../firebase/config';

function getFriendlyAuthMessage(code, fallback) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with that email.';
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/email-already-in-use':
      return 'Email is already in use.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    default:
      return fallback || 'Something went wrong. Please try again.';
  }
}

const AuthEmailScreen = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Please enter email and password');
        return;
      }
      setLoading(true);
      const user = await firebaseAuth.signInWithEmailAndPassword(email.trim(), password);
      console.log('user', user);
      console.log('user.user', user.user);    // this is the user object 
      console.log('user.user.uid', user.user.uid);
      console.log('user.user.email', user.user.email);
      console.log('user.user.displayName', user.user.displayName);
      console.log('user.user.photoURL', user.user.photoURL);
      console.log('user.user.phoneNumber', user.user.phoneNumber);
      console.log('user.user.providerData', user.user.providerData);
      console.log('user.user.metadata', user.user.metadata);
      console.log('user.user.stsTokenManager', user.user.stsTokenManager);
      console.log('user.user.toJSON', user.user.toJSON());
    } catch (e) {
      console.error('Login error', e);
      const code = e?.code || '';
      Alert.alert('Login failed', getFriendlyAuthMessage(code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Please enter email and password');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match');
        return;
      }
      setLoading(true);
      await firebaseAuth.createUserWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      console.error('Signup error', e);
      const code = e?.code || '';
      Alert.alert('Signup failed', getFriendlyAuthMessage(code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      if (!email) {
        Alert.alert('Please enter your email');
        return;
      }
      setLoading(true);
      await firebaseAuth.sendPasswordResetEmail(email.trim());
      Alert.alert('Password reset email sent');
      setMode('login');
    } catch (e) {
      console.error('Reset error', e);
      const code = e?.code || '';
      Alert.alert('Reset failed', getFriendlyAuthMessage(code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'}
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {mode !== 'reset' && (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        {mode === 'signup' && (
          <>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </>
        )}

        {mode === 'login' && (
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
          </TouchableOpacity>
        )}

        {mode === 'signup' && (
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignup} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create account'}</Text>
          </TouchableOpacity>
        )}

        {mode === 'reset' && (
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleReset} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Sending…' : 'Send reset link'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.linksRow}>
          {mode !== 'login' && (
            <TouchableOpacity onPress={() => setMode('login')}><Text style={styles.link}>Sign in</Text></TouchableOpacity>
          )}
          {mode !== 'signup' && (
            <TouchableOpacity onPress={() => setMode('signup')}><Text style={styles.link}>Sign up</Text></TouchableOpacity>
          )}
          {mode !== 'reset' && (
            <TouchableOpacity onPress={() => setMode('reset')}><Text style={styles.link}>Forgot password</Text></TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  card: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#111' },
  label: { fontSize: 14, color: '#333', marginBottom: 6, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  link: { color: '#007AFF' },
});

export default AuthEmailScreen;



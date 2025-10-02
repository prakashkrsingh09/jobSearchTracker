import React, { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // no-op wrapper retained for minimal code change; uses Alert natively
  const showAlert = (title, message) => Alert.alert(title, message);

  // Get responsive styles
  const styles = createResponsiveStyles();

  const isValidEmail = (value) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(value.trim());
  };

  // Password: at least 6 characters, at least one letter and one number
  const isValidPassword = (value) => {
    if (!value) return false;
    if (value.length < 6) return false;
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(value);
  };

  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const passwordValid = useMemo(() => (mode === 'reset' ? true : isValidPassword(password)), [password, mode]);
  const confirmValid = useMemo(
    () => (mode === 'signup' ? password === confirmPassword && isValidPassword(password) : true),
    [mode, password, confirmPassword]
  );

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Please enter email and password');
        return;
      }
      if (!emailValid) { showAlert('Invalid email address', 'Please enter a valid email.'); return; }
      if (!passwordValid) { showAlert('Invalid password', 'Use at least 6 characters with letters and numbers.'); return; }
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
      if (!emailValid) {
        Alert.alert('Invalid email address', 'Please enter a valid email.');
        return;
      }
      if (!isValidPassword(password)) {
        Alert.alert('Invalid password', 'Use at least 6 characters with letters and numbers.');
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
      if (!emailValid) {
        Alert.alert('Invalid email address', 'Please enter a valid email.');
        return;
      }
      setLoading(true);
      await firebaseAuth.sendPasswordResetEmail(email.trim());
      Alert.alert('Password reset',`The email has sent to ${email.trim()}`);
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
      <Text style={styles.appHeader}>Interview Sync</Text>
      <View style={styles.card}>
        <Text style={styles.title}>
          {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'}
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !!email && !emailValid && styles.inputError]}
          placeholder="Enter your email-address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onBlur={() => {
            if (email && !emailValid) {
              Alert.alert('Invalid email address', 'Please enter a valid email.');
            }
          }}
        />

        {mode !== 'reset' && (
          <>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, !!password && !isValidPassword(password) && styles.inputError, styles.inputWithIcon]}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onBlur={() => {
                  if (password && !isValidPassword(password)) {
                    Alert.alert('Invalid password', 'Use at least 6 characters with letters and numbers.');
                  }
                }}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword((v) => !v)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {mode === 'signup' && (
          <>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, !!confirmPassword && password !== confirmPassword && styles.inputError, styles.inputWithIcon]}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={() => {
                  if (confirmPassword && password !== confirmPassword) {
                    Alert.alert('Passwords do not match');
                  }
                }}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword((v) => !v)}>
                <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {mode === 'login' && (
          <TouchableOpacity
            style={[styles.button, (loading || !emailValid || !passwordValid) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading || !emailValid || !passwordValid}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
          </TouchableOpacity>
        )}

        {mode === 'signup' && (
          <TouchableOpacity
            style={[styles.button, (loading || !emailValid || !confirmValid) && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading || !emailValid || !confirmValid}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create account'}</Text>
          </TouchableOpacity>
        )}

        {mode === 'reset' && (
          <TouchableOpacity
            style={[styles.button, (loading || !emailValid) && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading || !emailValid}
          >
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

// Responsive styles function
const createResponsiveStyles = () => {
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375 || height < 667;
  const isLargeScreen = width > 414;

  return StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    card: { 
      width: isSmallScreen ? '95%' : isLargeScreen ? '85%' : '90%', 
      backgroundColor: '#fff', 
      padding: isSmallScreen ? 16 : 20, 
      borderRadius: 12, 
      shadowColor: '#000', 
      shadowOpacity: 0.1, 
      shadowRadius: 8, 
      elevation: 3 
    },
    title: { 
      fontSize: isSmallScreen ? 20 : isLargeScreen ? 24 : 22, 
      fontWeight: '700', 
      marginBottom: 12, 
      color: '#111' 
    },
    appHeader: { 
      fontSize: isSmallScreen ? 28 : isLargeScreen ? 48 : 40, 
      fontWeight: 'bold', 
      color: '#007AFF', 
      textAlign: 'center', 
      marginBottom: isSmallScreen ? 8 : 12 
    },
    label: { 
      fontSize: isSmallScreen ? 13 : 14, 
      color: '#333', 
      marginBottom: 6, 
      marginTop: 4 
    },
    input: { 
      borderWidth: 1, 
      borderColor: '#e5e7eb', 
      borderRadius: 8, 
      paddingHorizontal: 12, 
      paddingVertical: isSmallScreen ? 8 : 10, 
      marginBottom: 8,
      fontSize: isSmallScreen ? 14 : 16
    },
    inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
    inputWrapper: { position: 'relative' },
    inputWithIcon: { paddingRight: 52 },
    eyeIcon: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 2, width: 36 },
    button: { 
      backgroundColor: '#007AFF', 
      paddingVertical: isSmallScreen ? 10 : 12, 
      borderRadius: 8, 
      alignItems: 'center', 
      marginTop: 8 
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { 
      color: '#fff', 
      fontWeight: '600',
      fontSize: isSmallScreen ? 14 : 16
    },
    linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    link: { 
      color: '#007AFF',
      fontSize: isSmallScreen ? 13 : 14
    },
    toggleBtn: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 4 },
  });
};

export default AuthEmailScreen;



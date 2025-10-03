import React, { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { firebaseAuth } from '../firebase/config';
import AlertModal from '../components/AlertModal';
import PasswordValidator from '../components/PasswordValidator';

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

  // Get responsive styles
  const styles = createResponsiveStyles();

  const isValidEmail = (value) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(value.trim());
  };

  // Enhanced password validation with specific feedback
  const getPasswordValidationMessage = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters long';
    if (!/(?=.*[A-Za-z])/.test(value)) return 'Password must contain at least one letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return null; // Valid password
  };

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
        showAlert('Missing Information', 'Please enter email and password');
        return;
      }
      if (!emailValid) { 
        showAlert('Invalid Email', 'Please enter a valid email address.'); 
        return; 
      }
      if (!passwordValid) { 
        const passwordMessage = getPasswordValidationMessage(password);
        showAlert('Invalid Password', passwordMessage); 
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
      showAlert('Login Failed', getFriendlyAuthMessage(code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        showAlert('Missing Information', 'Please enter email and password');
        return;
      }
      if (!emailValid) {
        showAlert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      if (!isValidPassword(password)) {
        const passwordMessage = getPasswordValidationMessage(password);
        showAlert('Invalid Password', passwordMessage);
        return;
      }
      if (password !== confirmPassword) {
        showAlert('Password Mismatch', 'Passwords do not match. Please try again.');
        return;
      }
      setLoading(true);
      await firebaseAuth.createUserWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      console.error('Signup error', e);
      const code = e?.code || '';
      showAlert('Signup Failed', getFriendlyAuthMessage(code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      if (!email) {
        showAlert('Missing Email', 'Please enter your email address');
        return;
      }
      if (!emailValid) {
        showAlert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      setLoading(true);
      await firebaseAuth.sendPasswordResetEmail(email.trim());
      showAlert('Password Reset', `Password reset email has been sent to ${email.trim()}`);
      setMode('login');
    } catch (e) {
      console.error('Reset error', e);
      const code = e?.code || '';
      showAlert('Reset Failed', getFriendlyAuthMessage(code, e?.message));
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
              showAlert('Invalid Email', 'Please enter a valid email address.');
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
                    const passwordMessage = getPasswordValidationMessage(password);
                    showAlert('Invalid Password', passwordMessage);
                  }
                }}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword((v) => !v)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <PasswordValidator password={password} visible={mode === 'signup' && password.length > 0} />
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
                    showAlert('Password Mismatch', 'Passwords do not match. Please try again.');
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
      
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        showCancel={alertShowCancel}
        onCancel={() => setAlertVisible(false)}
        onOk={alertOnOk}
      />
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



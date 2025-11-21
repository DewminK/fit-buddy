import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { loginSchema } from '../../utils/validation';
import { lightTheme, darkTheme } from '../../constants/themes';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.auth);
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values: any) => {
      try {
        await dispatch(login(values)).unwrap();
        // Navigation will be handled by the root navigator
      } catch (err) {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    },
  });

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Feather name="activity" size={80} color={theme.colors.primary} />
            <Text style={styles.title}>FitBuddy</Text>
            <Text style={styles.subtitle}>Your Personal Fitness Companion</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.username}
                onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {formik.touched.username && formik.errors.username && (
              <Text style={styles.errorText}>{formik.errors.username}</Text>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoText}>Demo Credentials:</Text>
              <Text style={styles.demoCredentials}>Username: emilys</Text>
              <Text style={styles.demoCredentials}>Password: emilyspass</Text>
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    eyeIcon: {
      padding: theme.spacing.sm,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSize.sm,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
    },
    demoContainer: {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.info,
    },
    demoText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    demoCredentials: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    linkContainer: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    linkText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    linkTextBold: {
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
  });

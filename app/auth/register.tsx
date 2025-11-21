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
import { register } from '../../store/slices/authSlice';
import { registerSchema } from '../../utils/validation';
import { lightTheme, darkTheme } from '../../constants/themes';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.auth);
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values: any) => {
      try {
        await dispatch(register({
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
        })).unwrap();
        Alert.alert('Success', 'Account created successfully!');
      } catch (err) {
        Alert.alert('Registration Failed', 'Please try again');
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
          {/* Header */}
          <View style={styles.header}>
            <Feather name="user-plus" size={60} color={theme.colors.primary} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join FitBuddy Today</Text>
          </View>

          {/* Registration Form */}
          <View style={styles.form}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.firstName}
                onChangeText={formik.handleChange('firstName')}
                onBlur={formik.handleBlur('firstName')}
                autoCapitalize="words"
              />
            </View>
            {formik.touched.firstName && formik.errors.firstName && (
              <Text style={styles.errorText}>{formik.errors.firstName}</Text>
            )}

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.lastName}
                onChangeText={formik.handleChange('lastName')}
                onBlur={formik.handleBlur('lastName')}
                autoCapitalize="words"
              />
            </View>
            {formik.touched.lastName && formik.errors.lastName && (
              <Text style={styles.errorText}>{formik.errors.lastName}</Text>
            )}

            {/* Username */}
            <View style={styles.inputContainer}>
              <Feather name="at-sign" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
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

            {/* Email */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}

            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextBold}>Login</Text>
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
      paddingTop: theme.spacing.xl,
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

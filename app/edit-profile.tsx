import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';
import { useCustomModal } from '../hooks/useCustomModal';
import { darkTheme, lightTheme } from '../constants/themes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUser } from '../store/slices/authSlice';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const { modalConfig, hideModal, showSuccess, showError } = useCustomModal();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age?.toString() || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.age && (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    if (formData.height && parseFloat(formData.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      dispatch(updateUser({
        id: user!.id,
        username: user!.username,
        token: user!.token,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
      }));

      showSuccess('Success', 'Profile updated successfully!', () => router.back());
    } catch (error) {
      showError('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.saveButtonText, loading && styles.saveButtonTextDisabled]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={48} color={theme.colors.primary} />
            </View>
            <TouchableOpacity style={styles.avatarEditButton} activeOpacity={0.7}>
              <Feather name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.avatarSubtext}>Tap to change profile picture</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <View style={[styles.inputWrapper, focusedField === 'firstName' && styles.inputWrapperFocused, errors.firstName && styles.inputWrapperError]}>
              <Feather name="user" size={20} color={errors.firstName ? theme.colors.error : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => {
                  setFormData({ ...formData, firstName: text });
                  if (errors.firstName) setErrors({ ...errors, firstName: '' });
                }}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter first name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <View style={[styles.inputWrapper, focusedField === 'lastName' && styles.inputWrapperFocused, errors.lastName && styles.inputWrapperError]}>
              <Feather name="user" size={20} color={errors.lastName ? theme.colors.error : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => {
                  setFormData({ ...formData, lastName: text });
                  if (errors.lastName) setErrors({ ...errors, lastName: '' });
                }}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter last name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused, errors.email && styles.inputWrapperError]}>
              <Feather name="mail" size={20} color={errors.email ? theme.colors.error : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter email"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={[styles.inputWrapper, focusedField === 'phone' && styles.inputWrapperFocused]}>
              <Feather name="phone" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter phone number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Physical Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Years"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                placeholder="kg"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              placeholder="cm"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.requiredNote}>* Required fields</Text>
      </ScrollView>

      <CustomModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={hideModal}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      flex: 1,
      textAlign: 'center',
    },
    saveButton: {
      padding: theme.spacing.xs,
    },
    saveButtonText: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.primary,
    },
    saveButtonTextDisabled: {
      opacity: 0.5,
    },
    content: {
      flex: 1,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: theme.colors.primary + '40',
    },
    avatarEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    avatarText: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    avatarSubtext: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.primary,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    inputWrapperError: {
      borderColor: theme.colors.error,
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
    errorText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    requiredNote: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginVertical: theme.spacing.xl,
    },
  });

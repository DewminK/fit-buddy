import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface CustomModalProps {
  visible: boolean;
  type?: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDark?: boolean;
}

export default function CustomModal({
  visible,
  type = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  isDark = false,
}: CustomModalProps) {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: '#10B981' };
      case 'error':
        return { name: 'x-circle', color: '#EF4444' };
      case 'warning':
        return { name: 'alert-triangle', color: '#F59E0B' };
      case 'confirm':
        return { name: 'help-circle', color: '#3B82F6' };
      default:
        return { name: 'info', color: '#3B82F6' };
    }
  };

  const iconConfig = getIconConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.centeredView}>
          <Pressable>
            <Animated.View
              style={[
                styles.modalView,
                isDark ? styles.modalViewDark : styles.modalViewLight,
                {
                  transform: [{ scale: scaleValue }],
                },
              ]}
            >
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: `${iconConfig.color}20` }]}>
                <Feather name={iconConfig.name as any} size={40} color={iconConfig.color} />
              </View>

              {/* Title */}
              <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
                {title}
              </Text>

              {/* Message */}
              <Text style={[styles.message, isDark ? styles.messageDark : styles.messageLight]}>
                {message}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {type === 'confirm' && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.cancelButton,
                      isDark ? styles.cancelButtonDark : styles.cancelButtonLight,
                    ]}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isDark ? styles.cancelTextDark : styles.cancelTextLight,
                      ]}
                    >
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { backgroundColor: iconConfig.color },
                    type === 'confirm' && styles.confirmButtonHalf,
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    width: width - 60,
    maxWidth: 400,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalViewLight: {
    backgroundColor: '#FFFFFF',
  },
  modalViewDark: {
    backgroundColor: '#1F2937',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleLight: {
    color: '#1F2937',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  messageLight: {
    color: '#6B7280',
  },
  messageDark: {
    color: '#D1D5DB',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  cancelButtonLight: {
    backgroundColor: 'transparent',
    borderColor: '#E5E7EB',
  },
  cancelButtonDark: {
    backgroundColor: 'transparent',
    borderColor: '#374151',
  },
  confirmButton: {
    flex: 1,
  },
  confirmButtonHalf: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelTextLight: {
    color: '#6B7280',
  },
  cancelTextDark: {
    color: '#D1D5DB',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

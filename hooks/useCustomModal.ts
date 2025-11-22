import { useState } from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ModalConfig {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const initialState: ModalConfig = {
  visible: false,
  type: 'info',
  title: '',
  message: '',
  onClose: () => {},
  onConfirm: undefined,
  confirmText: 'OK',
  cancelText: 'Cancel',
};

export function useCustomModal() {
  const [modalConfig, setModalConfig] = useState<ModalConfig>(initialState);

  const hideModal = () => {
    setModalConfig(initialState);
  };

  const showModal = (config: Omit<ModalConfig, 'visible' | 'onClose'>) => {
    setModalConfig({
      ...config,
      visible: true,
      onClose: hideModal,
    });
  };

  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    showModal({ type: 'success', title, message, onConfirm, confirmText: 'OK' });
  };

  const showError = (title: string, message: string) => {
    showModal({ type: 'error', title, message, confirmText: 'OK' });
  };

  const showWarning = (title: string, message: string) => {
    showModal({ type: 'warning', title, message, confirmText: 'OK' });
  };

  const showInfo = (title: string, message: string) => {
    showModal({ type: 'info', title, message, confirmText: 'OK' });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) => {
    showModal({ type: 'confirm', title, message, onConfirm, confirmText, cancelText });
  };

  return {
    modalConfig,
    hideModal,
    showModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}

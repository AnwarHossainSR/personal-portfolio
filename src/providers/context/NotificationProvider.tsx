'use client';

/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AlertOptions {
  message?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ConfirmationOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface NotificationContextType {
  alert: AlertOptions | null;
  showAlert: (options: AlertOptions) => void;
  closeAlert: () => void;

  confirmation: ConfirmationOptions | null;
  showConfirmation: (options: ConfirmationOptions) => void;
  closeConfirmation: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<AlertOptions | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationOptions | null>(
    null
  );

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmation(options);
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  useEffect(() => {
    if (alert && alert.duration !== undefined) {
      const timer = setTimeout(() => closeAlert(), alert.duration);
      return () => clearTimeout(timer);
    }
  }, [alert, closeAlert]);

  const contextValue = useMemo(
    () => ({
      alert,
      showAlert,
      closeAlert,
      confirmation,
      showConfirmation,
      closeConfirmation,
    }),
    [
      alert,
      showAlert,
      closeAlert,
      confirmation,
      showConfirmation,
      closeConfirmation,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }
  return context;
};

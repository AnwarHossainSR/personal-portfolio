import { useNotificationContext } from '@/providers/context/NotificationProvider';

export const useAlert = () => {
  const { alert, showAlert, closeAlert } = useNotificationContext();
  return {
    alert,
    showAlert,
    closeAlert,
  };
};

import { useNotificationContext } from '@/providers/context/NotificationProvider';

export const useConfirmationDialog = () => {
  const { confirmation, showConfirmation, closeConfirmation } =
    useNotificationContext();
  return {
    confirmation,
    showConfirmation,
    closeConfirmation,
  };
};

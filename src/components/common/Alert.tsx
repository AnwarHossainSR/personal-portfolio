import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
}
const typeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const Alert: React.FC<AlertProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg transition-opacity duration-300 ${typeStyles[type]}`}
    >
      <div className="flex items-center">
        <div className="ml-3">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

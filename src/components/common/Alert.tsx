'use client';

import React from 'react';

import { useNotificationContext } from '@/providers/context/NotificationProvider';

const typeStyles: any = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const Alert: React.FC = () => {
  const { alert, closeAlert } = useNotificationContext();

  if (!alert) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg transition-opacity duration-300 ${alert.type && typeStyles[alert.type]}`}
    >
      <div className="flex items-center">
        <div className="ml-3">
          <p className="text-sm font-medium text-white">{alert.message}</p>
        </div>
        {closeAlert && (
          <button
            type="button"
            onClick={closeAlert}
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

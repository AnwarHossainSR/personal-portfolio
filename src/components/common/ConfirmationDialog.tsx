'use client';

/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';

import { useNotificationContext } from '@/providers/context/NotificationProvider';

const ConfirmationDialog: React.FC = () => {
  const { confirmation, closeConfirmation } = useNotificationContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (confirmation) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200); // Sync with closing animation duration
    }
  }, [confirmation]);

  if (!show || !confirmation) return null;

  const {
    title = 'Are you sure?',
    message = 'You won’t be able to revert this!',
    confirmButtonText = 'Yes, do it!',
    cancelButtonText = 'Cancel',
    onConfirm,
    onCancel,
  } = confirmation;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 z-50 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-200 ${
          show ? 'scale-100' : 'scale-95'
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-4 text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              closeConfirmation();
              onCancel && onCancel();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200 transition-all duration-200"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={() => {
              closeConfirmation();
              onConfirm && onConfirm();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 transition-all duration-200"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

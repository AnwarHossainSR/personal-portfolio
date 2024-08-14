/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react';

import type { ConfirmationOptions } from '@/types';

interface ConfirmationDialogProps extends ConfirmationOptions {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function ConfirmationDialog({
  title = 'Are you sure?',
  message = 'You won’t be able to revert this!',
  confirmButtonText = 'Yes, do it!',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
}: ConfirmationDialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 2000); // Sync with closing animation duration
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 z-50 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-200 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-4 text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onCancel && onCancel();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200 transition-all duration-200"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
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
}

export default ConfirmationDialog;

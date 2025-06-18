import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fade">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center transform animate-slideUp"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Clear Chat?</h2>
        <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">
          This will delete your entire chat history. Are you sure?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

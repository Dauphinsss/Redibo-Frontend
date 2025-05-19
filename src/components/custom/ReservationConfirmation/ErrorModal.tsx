import React from "react";
import { AlertTriangle } from 'lucide-react';
interface ErrorModalProps {
  message: string;
  onClose: () => void;
  visible: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center border-2 border-red-500">
        <div className="flex flex-col items-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-gray-800">{message}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;

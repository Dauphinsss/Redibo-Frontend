import { X } from "lucide-react";

interface AutoCancelNotificationProps {
  onClose: () => void;
}

export function AutoCancelNotification({ onClose }: AutoCancelNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between space-x-4 max-w-xs w-full">
      <span>
        La reserva fue cancelada automáticamente por falta de pago.
      </span>
      <button onClick={onClose}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

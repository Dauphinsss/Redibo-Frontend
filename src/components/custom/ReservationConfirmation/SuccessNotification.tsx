
import { CheckCircle } from "lucide-react";

type Props = {
  show: boolean;
  onClose: () => void;
};

export function SuccessModal({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[300px] text-center">
        <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">¡Reserva exitosa!</h2>
        <p className="text-gray-600 mb-4">Tu reserva ha sido creada correctamente.</p>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

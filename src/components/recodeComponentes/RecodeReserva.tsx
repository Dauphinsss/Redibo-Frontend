import { ReservaProps } from '@/interface/autosInterface';

export default function Reserva({ precio }: ReservaProps) {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500">PRECIO POR DIA</p>
      <p className="text-lg font-bold">{precio} BOB</p>
      <button className="mt-2 w-full py-2 bg-gray-200 text-white rounded-lg">
        Reserva
      </button>
    </div>
  );
}
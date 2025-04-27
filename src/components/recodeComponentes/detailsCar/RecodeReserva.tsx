import { ReservaProps } from '@/interface/autosInterface_Recode';

export default function Reserva({ precio }: ReservaProps) {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-lg font-bold">BOB. {precio}</p>
      <p className="text-sm text-gray-500">Precio por dia</p>
      <button className="mt-2 w-full py-2 bg-gray-200 text-white rounded-lg">
        Reserva
      </button>
    </div>
  );
}
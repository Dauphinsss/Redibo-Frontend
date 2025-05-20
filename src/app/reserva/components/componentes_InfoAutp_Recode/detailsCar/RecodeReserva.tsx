import { ReservaProps } from '@/app/reserva/interface/autosInterface_Recode';
import Link from 'next/link';

export default function Reserva({ id, precio }: ReservaProps) {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-lg font-bold">BOB. {precio}</p>
      <p className="text-sm text-gray-500">Precio por dia</p>
      <Link href={`/condicionesVisual_Recode/${id}`} target="_blank">
        <button className="mt-2 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition duration-300">
          Reserva
        </button>
      </Link>
    </div>
  );
}
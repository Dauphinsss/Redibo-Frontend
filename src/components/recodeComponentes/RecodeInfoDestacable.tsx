import { InfoDestacableProps } from '@/interface/autosInterface';

export default function InfoDestacable({ marca, modelo, placa, año }: InfoDestacableProps) {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-sm">
      <h3 className="font-semibold mb-2">Información destacable</h3>
      <div className="grid grid-cols-2 gap-2 text-center">
        <p>Marca</p><p>{marca}</p>
        <p>Modelo</p><p>{modelo}</p>
        <p>Placa</p><p>{placa}</p>
        <p>Año</p><p>{año}</p>
      </div>
    </div>
  );
}
import { InfoDestacableProps } from '@/interface/autosInterface';

export default function InfoDestacable({ marca, modelo, anio, soat }: InfoDestacableProps) {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-sm">
      <h3 className="font-semibold mb-2">Información destacable</h3>
      <div className="grid grid-cols-2 gap-2 text-center">
        <p>Marca</p><p>{marca}</p>
        <p>Modelo</p><p>{modelo}</p>
        <p>Año</p><p>{anio}</p>
        <p>SOAT</p>
        <p className={soat ? "text-green-600" : "text-red-600"}>
          {soat ? "Vigente" : "No vigente"}
        </p>
      </div>
    </div>
  );
}
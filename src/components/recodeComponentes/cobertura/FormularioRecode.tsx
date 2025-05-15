'use client';

import { ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";

interface Props {
  initialDataFor: ValidarInterface;
}

export default function FormularioCobertura({ initialDataFor }: Props) {
  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Formulario de Cobertura</h2>

      <p>
        ID del carro: <strong>{initialDataFor.id_carro}</strong>
      </p>

      <div className="space-y-2">
        <p>
          <strong>Empresa:</strong> {initialDataFor.Seguro.empresa}
        </p>
        <p>
          <strong>Fecha inicio:</strong> {initialDataFor.fecha_inicio}
        </p>
        <p>
          <strong>Fecha fin:</strong> {initialDataFor.fecha_fin}
        </p>
      </div>
    </div>
  );
}

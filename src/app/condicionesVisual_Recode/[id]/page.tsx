// src/app/condicionesVisual_Recode/[id]/page.tsx

import { notFound } from "next/navigation";
import TablaCondicionesVisual_Recode from "@/components/recodeComponentes/condicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import Header from "@/components/ui/Header";
import FechasWrapper from "./condiHomeVisual";

export default async function CondicionVisualPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const id_carro = parseInt(id, 10);

  if (isNaN(id_carro) || id_carro <= 0) {
    notFound();
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Header />

      <h1 className="text-2xl font-bold mb-6 text-center">
        Condiciones de Uso del Auto
      </h1>

      <div className="mb-6">
        <FechasWrapper id_carro={id_carro} />
      </div>

      <TablaCondicionesVisual_Recode id_carro={id_carro} />
    </main>
  );
}

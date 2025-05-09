// src/app/condicionesVisual/[id]/page.tsx

import TablaCondicionesVisual_Recode from "@/components/recodeComponentes/condicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";

export default async function CondicionVisualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const id_carro = parseInt(id, 10);

  if (!id_carro || isNaN(id_carro)) {
    return <div className="text-red-600 p-4">ID inválido</div>;
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Condiciones de Uso del Auto</h1>
      <TablaCondicionesVisual_Recode id_carro={id_carro} />
    </main>
  );
}

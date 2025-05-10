import { notFound } from "next/navigation";
import TablaCondicionesVisual_Recode from "@/components/recodeComponentes/condicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";

interface PageProps {
  params: { id: string };
}

export default function CondicionVisualPage({ params }: PageProps) {
  const id_carro = parseInt(params.id, 10);

  if (isNaN(id_carro) || id_carro <= 0) {
    notFound();
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Condiciones de Uso del Auto</h1>
      <TablaCondicionesVisual_Recode id_carro={id_carro} />
    </main>
  );
}

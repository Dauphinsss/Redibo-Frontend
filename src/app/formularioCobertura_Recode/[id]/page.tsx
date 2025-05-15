import { notFound } from "next/navigation";
import CoberturaRecodeClient from "./CoberturaRecodeClient";
import { getInsuranceByID } from "@/service/services_Recode";

export default async function Page({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id ?? '');

  try {
    const data = await getInsuranceByID(id);

    if (!data) return notFound();

    return <CoberturaRecodeClient initialData={data} />;
  } catch (error) {
    console.error(`Error inesperado al cargar auto con ID ${id}:`, error);
    throw error; // Redirige a error.tsx automáticamente
  }
}

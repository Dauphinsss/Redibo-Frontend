import { notFound } from "next/navigation";
import CoberturaRecodeClient from "./CoberturaRecodeClient";
import { getInsuranceByID } from "@/service/services_Recode";

export default async function Page({ params }: { params: { id: string }}) {
  
  const id = decodeURIComponent(params.id ?? '');
   try {
      const data = await getInsuranceByID(id);
  
      // Si el auto no existe, mostrar página 404
      if (!data) return notFound();
  
      // Si todo está bien, renderiza el componente Home con el ID
      return <CoberturaRecodeClient id={id} />;
    } catch (error) {
      console.error(`Error inesperado al cargar auto con ID ${id}:`, error);
      throw error; // Activa automáticamente error.tsx
    }
}

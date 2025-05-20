"use client";

import { useRouter } from "next/navigation";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { postCobertura} from "@/service/services_Recode";

interface BotonValidarProps {
  coberturas: CoberturaInterface[];
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function BotonValidar({
  coberturas,
  isSubmitting,
  setIsSubmitting,
}: BotonValidarProps) {
  const router = useRouter();

  const handleGuardar = async () => {
    if (coberturas.length === 0) return;

    try {
      setIsSubmitting(true);
      for (const cobertura of coberturas) {
        await postCobertura(cobertura);
      }
      router.push("/listadoPrueba");
    } catch (error) {
      console.error("Error al guardar coberturas:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleGuardar}
      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
      disabled={isSubmitting}
    >
      {isSubmitting && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {isSubmitting ? "Guardando..." : "Guardar condiciones"}
    </button>
  );
}

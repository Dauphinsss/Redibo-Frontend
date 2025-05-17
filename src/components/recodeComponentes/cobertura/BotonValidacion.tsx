import { useState } from "react";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { postCobertura } from "@/service/services_Recode";
import ModalRecode from "@/components/recodeComponentes/condicionesDeUsoAutoFormu/ModalRecode";

interface Props {
  coberturas: CoberturaInterface[];
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function BotonValidar({ coberturas, isSubmitting, setIsSubmitting }: Props) {
  const [mostrarPregunta, setMostrarPregunta] = useState(false);
  const [modalResultado, setModalResultado] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    description: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    description: "",
  });

  const enviarCoberturas = async () => {
    setIsSubmitting(true);
    try {
      for (const cobertura of coberturas) {
        await postCobertura(cobertura);
      }

      setModalResultado({
        open: true,
        variant: "success",
        title: "Validación exitosa",
        description: "Las coberturas se enviaron correctamente.",
      });
    } catch (err) {
      console.error("Error al enviar coberturas:", err);
      setModalResultado({
        open: true,
        variant: "error",
        title: "Error al validar",
        description: "Hubo un problema al enviar las coberturas.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmarEnvio = () => setMostrarPregunta(true);
  const cancelar = () => setMostrarPregunta(false);
  const aceptar = () => {
    setMostrarPregunta(false);
    enviarCoberturas();
  };

  return (
    <>
      <button
        onClick={confirmarEnvio}
        disabled={coberturas.length === 0 || isSubmitting}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
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
        {isSubmitting ? "Validando..." : "Validar coberturas"}
      </button>

      {/* Modal de confirmación */}
      <ModalRecode
        isOpen={mostrarPregunta}
        onClose={cancelar}
        title="¿Confirmar validación?"
        description="¿Estás seguro de que deseas validar y enviar estas coberturas?"
        variant="question"
        showConfirm
        onConfirm={aceptar}
      />

      {/* Modal de resultado */}
      <ModalRecode
        isOpen={modalResultado.open}
        onClose={() => setModalResultado((prev) => ({ ...prev, open: false }))}
        title={modalResultado.title}
        description={modalResultado.description}
        variant={modalResultado.variant}
        autoCloseAfter={3000}
      />
    </>
  );
}
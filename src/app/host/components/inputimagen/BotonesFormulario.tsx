"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface BotonesFormularioProps {
  isFormValid: boolean;
  onSubmit: () => Promise<{ success: boolean; error?: string }>;
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ 
  isFormValid, 
  onSubmit 
}) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const { success, error } = await onSubmit();
      
      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => router.push("/host/pages"), 2000);
      } else {
        setSubmitError(error || "Error al enviar el formulario");
      }
    } catch (error: unknown) {
      let errorMessage = "Error desconocido";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full max-w-5xl flex justify-end mt-10 px-10">
      {/* Mensajes de estado */}
      {submitError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ¡Vehículo registrado con éxito! Redirigiendo...
        </div>
      )}

      {/* Botón Finalizar con los colores de "Siguiente" */}
      <Button
        variant="default"
        className={`w-50 h-12 text-lg font-semibold text-white ${
          isFormValid && !isSubmitting 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
        }`}
        onClick={() => setConfirmOpen(true)}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "FINALIZAR"
        )}
      </Button>

      {/* Diálogo de confirmación */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Confirmar publicación del vehículo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Al confirmar, su vehículo será publicado y estará disponible para alquiler. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BotonesFormulario;
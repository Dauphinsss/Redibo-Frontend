"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResponderButtonProps {
  commentId?: number;
  onSuccess?: (nuevaRespuesta: any) => void;
  onSubmit?: (commentId: number, replyText: string) => Promise<any>;
  disabled?: boolean;
  onResponderClick?: () => void; // para scroll
  isActive: boolean; // Nuevo: si el cuadro está abierto
  onToggle: () => void; // Nuevo: para abrir/cerrar desde el padre
}

const MAX_LENGTH = 200;

const ResponderButton = ({
  commentId,
  onSuccess,
  onSubmit,
  disabled = false,
  onResponderClick,
  isActive,
  onToggle,
}: ResponderButtonProps) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cuando isActive cambia a true, llamamos a onResponderClick y enfocamos textarea
  useEffect(() => {
    if (isActive) {
      onResponderClick?.();

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } else {
      // Cuando se cierra el cuadro, limpiamos texto
      setReplyText("");
    }
  }, [isActive, onResponderClick]);

  const handleSend = async () => {
    const textoLimpiado = replyText.trim();

    if (!textoLimpiado) {
      toast.warning("La respuesta no puede estar vacía");
      return;
    }

    if (textoLimpiado.length > MAX_LENGTH) {
      toast.warning(
        `La respuesta no puede superar los ${MAX_LENGTH} caracteres`
      );
      return;
    }

    if (!commentId || isNaN(commentId)) {
      toast.error("ID de comentario no válido");
      console.error("commentId inválido:", commentId);
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        const nuevaResp = await onSubmit(commentId, textoLimpiado);
        toast.success("Respuesta enviada con éxito");
        onToggle(); // cerramos cuadro
        onSuccess?.(nuevaResp);
      }
    } catch (error: any) {
      console.error("Error al enviar respuesta:", error);
      toast.error(error?.message || "Error al enviar respuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        disabled={loading || disabled}
      >
        {disabled ? "Respuesta enviada" : isActive ? "Cancelar" : "Responder"}
      </Button>

      {isActive && !disabled && (
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escribe tu respuesta... (máx. 200 caracteres)"
            className="w-full mt-1 border rounded p-2 text-sm"
            rows={3}
            disabled={loading}
            maxLength={MAX_LENGTH}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>
              {replyText.length}/{MAX_LENGTH} caracteres
            </span>
            <Button size="sm" onClick={handleSend} disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponderButton;

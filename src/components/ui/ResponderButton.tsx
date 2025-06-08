"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResponderButtonProps {
  commentId?: number;
  onSuccess?: (nuevaRespuesta: any) => void;
  onSubmit?: (commentId: number, replyText: string) => Promise<any>;
  disabled?: boolean;
}

const MAX_LENGTH = 200;

const ResponderButton = ({
  commentId,
  onSuccess,
  onSubmit,
  disabled = false,
}: ResponderButtonProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleReplying = () => {
    if (loading || disabled) return;
    setIsReplying((prev) => !prev);
    if (isReplying) {
      setReplyText("");
    }
  };

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
        setIsReplying(false);
        setReplyText("");
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
        onClick={toggleReplying}
        disabled={loading || disabled}
      >
        {disabled ? "Respuesta enviada" : isReplying ? "Cancelar" : "Responder"}
      </Button>

      {isReplying && !disabled && (
        <div className="mt-2">
          <textarea
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

import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { postCobertura } from "@/service/services_Recode";

interface Props {
  coberturas: CoberturaInterface[];
  onSuccess?: () => void;
}

export default function BotonValidar({ coberturas, onSuccess }: Props) {
  const enviarCoberturas = async () => {
    try {
      for (const cobertura of coberturas) {
        await postCobertura(cobertura);
      }
      alert("Coberturas enviadas correctamente.");
      onSuccess?.();
    } catch (err) {
      console.error("Error al enviar coberturas:", err);
      alert("Error al enviar coberturas.");
    }
  };

  return (
    <button
      className="px-6 py-2 bg-black text-white rounded font-semibold"
      onClick={enviarCoberturas}
      disabled={coberturas.length === 0}
    >
      Validar
    </button>
  );
}

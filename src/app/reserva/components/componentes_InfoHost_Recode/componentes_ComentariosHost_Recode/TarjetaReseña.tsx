import { useState } from "react";
import EstrellasMostrar from "./EstrellasMostrar";
import TarjetaRespuesta from "./TarjetaRespuesta";
import { postCalificacionHost } from "@/app/reserva/services/services_reserva";
import EstrellasInteractiva from "./EstrellasInteractiva";

export type Respuesta = {
    nombre: string;
    fecha: string;
    contenido: string;
};

type Props = {
    nombre: string;
    fecha: string;
    calificacion: number;
    comentario: string;
    respuestas?: Respuesta[];
    onResponder?: () => void;
    className?: string;
    id_host: number;
    id_renter: number;
};

const TarjetaReseña = ({
    nombre,
    fecha,
    calificacion,
    comentario,
    respuestas = [],
    onResponder,
    className = "",
    id_host,
    id_renter,
}: Props) => {
    const [calificacionActual, setCalificacionActual] = useState(calificacion);

    const handleCalificacion = async (nuevaCalificacion: number) => {
        const resultado = await postCalificacionHost(id_host, id_renter, nuevaCalificacion);
            if (resultado) {
                setCalificacionActual(nuevaCalificacion);
                console.log("✅ Calificación enviada:", resultado);
            } else {
                console.error("❌ Error al enviar calificación");
        }
    };

    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center">👤</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                        <p className="font-bold">{nombre}</p>
                        <p className="text-xs text-gray-500">{fecha}</p>
                    </div>

                    <EstrellasInteractiva
                    valorInicial={calificacionActual}
                    onCalificar={handleCalificacion}
                    />
                    <p className="text-sm mt-2">{comentario}</p>

                    {onResponder && (
                        <button
                        onClick={onResponder}
                        className="mt-2 text-sm text-gray-700 flex items-center gap-1"
                        >
                        
                        </button>
                    )}

                    {respuestas.length > 0 && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-semibold">Respuestas ⌄</summary>
                            <div className="mt-2 space-y-2">
                                {respuestas.map((r, i) => (
                                <TarjetaRespuesta key={i} {...r} />
                                ))}
                            </div>
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TarjetaReseña;

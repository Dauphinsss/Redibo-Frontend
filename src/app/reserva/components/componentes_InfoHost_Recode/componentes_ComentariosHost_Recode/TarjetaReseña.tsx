import EstrellasMostrar from "./EstrellasMostrar";
import TarjetaRespuesta from "./TarjetaRespuesta";

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
};

const TarjetaReseña = ({
    nombre,
    fecha,
    calificacion,
    comentario,
    respuestas = [],
    onResponder,
    className = "",
}: Props) => {
    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center">👤</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                        <p className="font-bold">{nombre}</p>
                        <p className="text-xs text-gray-500">{fecha}</p>
                    </div>
                    <EstrellasMostrar valor={calificacion} />
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

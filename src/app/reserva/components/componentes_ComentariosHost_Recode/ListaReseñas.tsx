"use client";

import { useState } from "react";
import TarjetaReseña, { Respuesta } from "./TarjetaReseña";
import CajaComentario from "./CajaComentario";

type Reseña = {
    nombre: string;
    fecha: string;
    calificacion: number;
    comentario: string;
    respuestas?: Respuesta[];
};

const reseñasEjemplo: Reseña[] = [
    {
        nombre: "Nombre de renter",
        fecha: "12 de mayo de 2025",
        calificacion: 3,
        comentario: "Buen servicio, aunque se puede mejorar.",
        respuestas: [
        {
            nombre: "Nombre de host",
            fecha: "13 de mayo de 2025",
            contenido: "Gracias por el comentario, tomaremos nota.",
        },
        ],
    },
    {
        nombre: "Otro renter",
        fecha: "10 de mayo de 2025",
        calificacion: 5,
        comentario: "Excelente todo.",
    },
];

const ListaReseñas = () => {
    const [comentario, setComentario] = useState("");

    const manejarEnvio = () => {
        if (comentario.trim() === "") return;
        console.log("Comentario enviado:", comentario);
        setComentario("");
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">
                Tiene {reseñasEjemplo.length} reseñas
            </h2>

            <CajaComentario
                valor={comentario}
                onCambiar={setComentario}
                onCancelar={() => setComentario("")}
                onEnviar={manejarEnvio}
            />

            <div className="mt-6">
                {reseñasEjemplo.map((res, i) => (
                    <TarjetaReseña
                        key={i}
                        nombre={res.nombre}
                        fecha={res.fecha}
                        calificacion={res.calificacion}
                        comentario={res.comentario}
                        respuestas={res.respuestas}
                        onResponder={() => console.log("Responder a:", res.nombre)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListaReseñas;

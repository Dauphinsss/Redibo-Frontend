"use client";

import { useEffect,useState } from "react";
import TarjetaReseña from "./TarjetaReseña";
import CajaComentario from "./CajaComentario";
import { getComentariosHost, postComentarioHost } from "@/app/reserva/services/services_reserva";

// type Reseña = {
//     nombre: string;
//     fecha: string;
//     calificacion: number;
//     comentario: string;
//     respuestas?: Respuesta[];
// };
type Comentario = {
  id: number;
  id_host: number;
  id_renter: number;
  comentario: string;
  fecha: string;
};

type Props = {
    id_host: number;
    id_renter: number;
}


// const reseñasEjemplo: Reseña[] = [
//     {
//         nombre: "Nombre de renter",
//         fecha: "12 de mayo de 2025",
//         calificacion: 3,
//         comentario: "Buen servicio, aunque se puede mejorar.",
//         respuestas: [
//         {
//             nombre: "Nombre de host",
//             fecha: "13 de mayo de 2025",
//             contenido: "Gracias por el comentario, tomaremos nota.",
//         },
//         ],
//     },
//     {
//         nombre: "Otro renter",
//         fecha: "10 de mayo de 2025",
//         calificacion: 5,
//         comentario: "Excelente todo.",
//     },
// ];

const ListaReseñas = ({id_host, id_renter}: Props) => {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [comentario, setComentario] = useState("")

    // const manejarEnvio = () => {
    //     if (comentario.trim() === "") return;
    //     console.log("Comentario enviado:", comentario);
    //     setComentario("");
    // };
    const cargarComentarios = async () => {
    const data = await getComentariosHost(id_host);
    if (data) {
      setComentarios(data);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [id_host]);

  const manejarEnvio = async () => {
    if (comentario.trim() === "") return;
    const response = await postComentarioHost(id_host, id_renter, comentario);
    if (response) {
      setComentario("");
      cargarComentarios();
    }
  };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">
                Tiene {comentarios.length} reseñas
            </h2>

            <CajaComentario
                valor={comentario}
                onCambiar={setComentario}
                onCancelar={() => setComentario("")}
                onEnviar={manejarEnvio}
            />

            <div className="mt-6">
                {comentarios.map((res, i) => (
                    <TarjetaReseña
                        key={i}
                        nombre={`Renter ${res.id_renter}`}
                        fecha={new Date(res.fecha).toLocaleDateString()}
                        calificacion={0} // Puedes ajustar esto si tienes la calificación
                        comentario={res.comentario}
                        respuestas={[]}
                        onResponder={() => console.log("Responder a:", res.id_renter)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListaReseñas;

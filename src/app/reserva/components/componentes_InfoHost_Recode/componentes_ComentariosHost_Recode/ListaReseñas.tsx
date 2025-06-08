"use client";

import { useEffect,useState } from "react";
import TarjetaReseña from "./TarjetaReseña";
import CajaComentario from "./CajaComentario";
import { getComentariosHost, postComentarioHost } from "@/app/reserva/services/services_reserva";


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


const ListaReseñas = ({id_host, id_renter}: Props) => {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [comentario, setComentario] = useState("")

    
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
      const nuevoComentario: Comentario = {
        id: Date.now(),
        id_host,
        id_renter,
        comentario,
        fecha: new Date().toISOString(),
      }
      setComentarios([nuevoComentario, ...comentarios]);
      setComentario("");
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
                        calificacion={0} 
                        comentario={res.comentario}
                        respuestas={[]}
                        onResponder={() => console.log("Responder a:", res.id_renter)}
                        id_host={id_host}
                        id_renter={id_renter}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListaReseñas;

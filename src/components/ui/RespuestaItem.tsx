"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Ya no se necesita esta interfaz
// interface Usuario { ... }

interface Respuesta {
  id: number;
  respuesta: string;
  fecha_creacion: string | Date;
}

interface RespuestaItemProps {
  respuesta: {
    id: number;
    respuesta: string;
    fecha_creacion: string | Date;
  };
  onEliminar: (idRespuesta: number) => void;
}

export default function RespuestaItem({
  respuesta,
  onEliminar,
}: RespuestaItemProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    }
    if (menuAbierto) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAbierto]);

  const fechaValida =
    respuesta.fecha_creacion &&
    !isNaN(new Date(respuesta.fecha_creacion).getTime());

  return (
    <div className="mb-4 bg-gray-50 rounded p-3 shadow-sm relative">
      <p className="text-gray-700 whitespace-pre-line">{respuesta.respuesta}</p>

      <p className="mt-1 text-xs text-gray-500">
        {fechaValida
          ? format(new Date(respuesta.fecha_creacion), "d MMM yyyy", {
              locale: es,
            })
          : "Fecha no disponible"}
      </p>

      {/* Botón de tres puntos */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          aria-label="Opciones"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &#x22EE;
        </button>

        {menuAbierto && (
          <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10">
            <button
              className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
              onClick={() => {
                onEliminar(respuesta.id);
                setMenuAbierto(false);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

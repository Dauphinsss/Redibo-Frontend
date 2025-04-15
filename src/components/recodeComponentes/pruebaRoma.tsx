import React from "react";
import Header from "@/components/ui/Header"; // Importando el Header desde la carpeta ui
import { FaStar, FaUserCircle } from "react-icons/fa";
import coche2 from "@/assets/coche2.jpg";
import Comment from "@/components/recodeComponentes/coment"; // Importando el componente Comment

function PruebaC() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 pb-32 px-5">
      {/* Header */}
      <Header /> 

      {/* Contenedor en dos columnas en versión web */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna 1: Nombre, Imagen y Precio */}
        <div className="flex flex-col items-start lg:ml-10">
          {/* Nombre */}
          <h1 className="text-3xl font-bold mb-4">NOMBRE</h1>

          {/* Imagen más grande en versión web manteniendo proporciones */}
          <img src={coche2.src} alt="Coche" className="w-64 h-auto sm:w-80 lg:w-96 rounded-md shadow-md mb-4" />

          {/* Precio debajo de la imagen */}
          <div className="text-left mb-4">
            <p className="text-sm font-medium">Precio por días</p>
            <p className="text-lg font-bold">BOB 0.00</p>
          </div>

          {/* Línea divisoria y descripción del auto */}
          <hr className="w-full border-t border-gray-300 my-6" />
          <h2 className="text-lg font-semibold mb-2">Descripción del auto</h2>
          <p className="text-sm text-gray-600">Aquí puedes agregar información sobre las características del vehículo.</p>
        </div>

        {/* Columna 2: Ubicación y comentarios */}
        <div className="flex flex-col items-start lg:mr-10">
          {/* Ubicación */}
          <div className="border-t border-gray-300 pt-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Descripción de ubicación</h2>
            <p className="text-sm mb-4">Aquí se agregará información más detallada sobre la ubicación del lugar.</p>
            <div className="bg-gray-200 h-60 rounded-md flex items-center justify-center">
              <span className="text-gray-500">Mapa aquí</span>
            </div>
          </div>

          {/* Comentarios */}
          <div className="border-t border-gray-300 pt-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
            {/* Uso del componente Comment */}
            <Comment
              username="Usuario 1"
              date="20 de abril de 2025"
              content="Detalle del comentario"
              rating={9.9}
            />
            <Comment
              username="Usuario 2"
              date="15 de abril de 2025"
              content="Detalle del comentario"
              rating={9.8}
            />
          </div>
        </div>
      </div>

      {/* Contenedor flexible con el precio y botón de reserva alineados a la derecha */}
      <div className="fixed bottom-0 left-0 w-full bg-black flex items-center px-4 py-1 z-50">
        <button className="bg-black text-white py-1 px-8 rounded-none hover:bg-gray-800 flex-1">
          RESERVA
        </button>
        <div className="bg-white py-1 px-3 rounded-md shadow-sm ml-auto">
          <p className="text-xs font-medium">Precio por días</p>
          <p className="text-sm font-bold">BOB 0.00</p>
        </div>
      </div>
    </div>
  );
}

export default PruebaC;
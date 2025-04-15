import React from "react";
import Header from "@/components/ui/Header"; 
import { FaStar, FaUserCircle } from "react-icons/fa";
import coche2 from "@/assets/coche2.jpg";
import Comment from "@/components/recodeComponentes/RecodeComment"; 

const MobileView = () => (
  <div className="p-4 pb-32">
    <Header />

    {/* Contenido principal para móvil */}
    <div className="flex flex-col items-start gap-4">
      {/* Información del vehículo */}
      <section>
        <h1 className="text-2xl font-bold mb-4">NOMBRE</h1>
        <img
          src={coche2.src}
          alt="Coche"
          className="w-64 h-auto rounded-md shadow-md mb-4"
        />
        <p className="text-sm font-medium">Precio por días</p>
        <p className="text-lg font-bold">BOB 0.00</p>
        <hr className="border-t border-gray-300 my-4" />
        <h2 className="text-lg font-semibold mb-2">Descripción del auto</h2>
        <p className="text-sm text-gray-600">
          Aquí puedes agregar información sobre las características del vehículo.
        </p>
      </section>

      {/* Ubicación */}
      <section className="pt-4">
        <h2 className="text-lg font-semibold mb-2">Descripción de ubicación</h2>
        <p className="text-sm mb-4">
          Aquí se agregará información más detallada sobre la ubicación del lugar.
        </p>
        <div className="bg-gray-200 h-60 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Mapa aquí</span>
        </div>
      </section>

      {/* Comentarios */}
      <section className="pt-4">
        <h2 className="text-lg font-semibold mb-2">Comentarios</h2>
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
      </section>
    </div>
  </div>
);

const WebView = () => (
  <div className="p-8 lg:p-10 pb-32">
    
    <Header />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold mb-4">NOMBRE</h1>
        <img
          src={coche2.src}
          alt="Coche"
          className="w-96 h-auto rounded-md shadow-md mb-4"
        />
        <p className="text-sm font-medium">Precio por días</p>
        <p className="text-lg font-bold">BOB 0.00</p>
        <hr className="border-t border-gray-300 my-4" />
        <h2 className="text-lg font-semibold mb-2">Descripción del auto</h2>
        <p className="text-sm text-gray-600">
          Aquí puedes agregar información sobre las características del vehículo.
        </p>
      </div>

 
      <div className="flex flex-col items-start">
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Descripción de ubicación</h2>
          <p className="text-sm mb-4">
            Aquí se agregará información más detallada sobre la ubicación del lugar.
          </p>
          <div className="bg-gray-200 h-60 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Mapa aquí</span>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Comentarios</h2>
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
        </section>
      </div>
    </div>
  </div>
);

const PruebaC = () => (
  <div>
    {/* Detecta el tamaño de la pantalla */}
    <div className="block lg:hidden">
      <MobileView />
    </div>
    <div className="hidden lg:block">
      <WebView />
    </div>
  </div>
);

export default PruebaC;
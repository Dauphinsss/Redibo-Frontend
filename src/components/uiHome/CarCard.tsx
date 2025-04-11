"use client";

interface CarCardProps {
  name: string;
  price: string;
  rating: number;

}

export default function CarCard({ name, price, rating}: CarCardProps) {
  return (
    <div className="
      w-[620px]              /* ancho exacto de Figma */
      h-[250px]              /* alto exacto de Figma */
      border                 /* borde 1px */
      border-black        /* color de borde */
      rounded-[15px]         /* bordes redondeados de 15px */
      p-6                    /* padding interior */
      shadow-sm              /* sombra suave */
      bg-white               /* fondo blanco */
      flex                   /* layout en fila */
      gap-6                  /* espacio entre columnas */
      mx-auto                /* centrado horizontal */
    ">
      <div className="relative w-[270px] h-[125px]">
      <div className="absolute -top-3 left-1 flex gap-11">
        <button className="flex items-center gap-2 px-3 py-1 border border-black rounded-full text-sm">
          <span>♡</span> Guardar
        </button>
        <button className="flex items-center gap-2 px-3 py-1 border border-black rounded-full text-sm">
          <span>↪</span> Compartir
        </button>
      </div>
        <div className="absolute top-7 left-1 w-[250px] h-[150px] bg-gray-200 rounded-[10px] text-center">
          🚗 Imagen aquí
        </div>
      </div>



      <div className="flex-1">
        <h2 className="font-bold text-lg">{name}</h2>
        <p className="text-sm">⭐ {rating} / 10</p>
        <p className="text-sm text-gray-700">{price} por día</p>
        <button className="mt-2 bg-black text-white px-4 py-1 rounded">Reservar</button>
      </div>
    </div>
  );
}

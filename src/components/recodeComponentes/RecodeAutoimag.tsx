interface AutoImagProps {
    imagenes: { id: number; data: string }[];
    nombre: string;
  }
  
  export default function Autoimag({ imagenes, nombre }: AutoImagProps) {
    const tieneImagenes = imagenes.length > 0;
    
    return (
      <section className="max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{nombre}</h2>
        <div className="flex flex-col lg:flex-row-reverse gap-2">
          {tieneImagenes ? (
            <img
              src={imagenes[0].data}
              alt={`${nombre} - Vista principal`}
              className="w-full lg:w-2/3 rounded-lg object-cover h-64"
            />
          ) : (
            <div className="w-full lg:w-2/3 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Imagen no disponible</span>
            </div>
          )}
  
          <div className="hidden lg:flex flex-col gap-2 w-1/3">
            {tieneImagenes && imagenes.length > 1 ? (
              imagenes.slice(1, 3).map((img) => (
                <img 
                  key={img.id}
                  src={img.data} 
                  alt={`${nombre} - Vista ${img.id}`}
                  className="rounded-lg object-cover h-32"
                />
              ))
            ) : (
              <>
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Miniatura 1</span>
                </div>
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Miniatura 2</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }
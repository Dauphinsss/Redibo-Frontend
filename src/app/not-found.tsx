import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Ups algo pasó acá</h1>
            <h2 className="text-5xl font-extrabold text-red-500 mb-8">ERROR 404</h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-4">Si quieres puedes ir a:</p>
              
              <div className="space-y-2">
                <p className="text-gray-500">Link del home:</p>
                <Link 
                  href="/" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Página de inicio
                </Link>
              </div>
              
              <div className="space-y-2 mt-4">
                <p className="text-gray-500">Resultados de búsqueda:</p>
                <Link 
                  href="/homeBuscador" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Ver resultados
                </Link>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="https://res.cloudinary.com/dzoeeaovz/image/upload/v1745119055/Error404_ffbvg7.png"
              alt="Error 404"
              width={500}
              height={500}
              className="w-full max-w-xs md:max-w-md"
            />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm border-t">
        <p>© {new Date().getFullYear()} Somos REDIBO. Un gusto poder ayudarte¡¡¡</p>
      </footer>
    </div>
  );
}
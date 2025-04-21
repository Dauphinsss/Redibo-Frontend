import { FaUserCircle, FaStar, FaCar, FaWhatsapp } from 'react-icons/fa';
interface DescriHostProps {
  nombreHost: string;
  calificacion: number;
  numAuto: number;
}

export default function DescriHost({ 
  nombreHost, 
  calificacion, 
  numAuto 
}: DescriHostProps) {
  return (
    <section className="w-full border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <FaUserCircle className="w-12 h-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold">Conoce a tu host</h3>
            <div className="space-y-1 mt-1">
              <p className="font-medium">{nombreHost}</p>
              <div className="flex items-center gap-2 text-sm">
                <FaStar className="text-gray-300" />
                <span>{calificacion.toFixed(1)} calificación</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaCar className="text-gray-500" />
                <span>{numAuto} autos</span>
              </div>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-800 transition">
          <FaWhatsapp /> Contáctalo
        </button>
      </div>
    </section>
  );
}
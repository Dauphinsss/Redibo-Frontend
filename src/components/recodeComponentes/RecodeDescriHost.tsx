import { FaUserCircle, FaStar, FaCar, FaWhatsapp } from 'react-icons/fa';

export default function DescriHost() {
  return (
    <section className="w-full border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <FaUserCircle className="w-12 h-12 text-gray-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold">Conoce a tu host</h3>
            <div className="space-y-1 mt-1">
              <p className="font-medium">Nombre del Host</p>
              <div className="flex items-center gap-2 text-sm">
                <FaStar className="text-black" />
                <span>4.5 calificación</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaCar className="text-gray-500" />
                <span>5 autos</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-base bg-black text-white rounded-lg hover:bg-black transition w-full sm:w-auto"
        >
          <FaWhatsapp className="w-5 h-5" />
          Contáctalo
        </button>
      </div>
    </section>
  )
}

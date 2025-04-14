
import { FaWhatsapp } from 'react-icons/fa';

export default function Contactar() {
  return (
    <section className="w-full max-w-5xl px-4 py-8 text-center">
      <button
        type = "button"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-base bg-black text-white rounded-lg hover:bg-gray-800-600 transition"
      >
        <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        Contáctalo
      </button>
    </section>
  );
}

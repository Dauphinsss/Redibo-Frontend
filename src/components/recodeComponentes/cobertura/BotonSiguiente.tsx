import Link from 'next/link';
import { memo } from 'react';

interface BotonSiguienteProps {
  to: string;
}

function BotonSiguiente({ to }: BotonSiguienteProps) {
  return (
    <Link
      href={to}
      className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-400 transition"
    >
      Siguiente
    </Link>
  );
}

export default memo(BotonSiguiente);

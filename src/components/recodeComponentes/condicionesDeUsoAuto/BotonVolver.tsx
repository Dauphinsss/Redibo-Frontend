import Link from 'next/link';
import { memo } from 'react';

interface BotonVolverProps {
  to: string;
}

function BotonVolver({ to }: BotonVolverProps) {
  return (
    <Link
      href={to}
      className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-400 transition"
    >
      Volver
    </Link>
  );
}

export default memo(BotonVolver);

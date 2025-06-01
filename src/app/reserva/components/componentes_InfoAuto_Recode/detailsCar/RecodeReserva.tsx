'use client';

import { ReservaProps } from '@/app/reserva/interface/autosInterface_Recode';
import { useRouter } from 'next/navigation';

export default function Reserva({ id, precio }: ReservaProps) {  
  
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
      if (!token) {
      window.location.href = "/login";
    }
    
  router.push(`/reserva/page/condicionesVisual_Recode/${id}`);

  }

  
  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-lg font-bold">BOB. {precio}</p>
      <p className="text-sm text-gray-500">Precio por dia</p>
      <form onSubmit= {handleSubmit}>  
        <button className="mt-2 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition duration-300">
          Reserva
        </button>
      </form>
      
    </div>
  );
}
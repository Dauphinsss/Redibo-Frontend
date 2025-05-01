"use client";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
export default function Page() {
  const router = useRouter();
  return (
    <div className="flex h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-xl max-w-md m-auto">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Error.. Vehículo No Disponible</h1>
          <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p className="text-xl font-normal text-gray-600 mt-5 mb-6">Ups... lo sentimos, el automóvil que ha solicitado ya ha sido reservado/tomado. </p>
          <hr />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => router.back()}>Volver Atrás</Button>
            <Button variant="default" onClick={() => router.push('/reservas')}>
              Elegir otro auto
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
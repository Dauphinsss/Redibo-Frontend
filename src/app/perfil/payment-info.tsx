import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

export function PaymentInfo() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No se encontró el token de autenticación");
          return;
        }

        const response = await axios.get(`${API_URL}/api/get-saldo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setBalance(response.data.saldo);
      } catch (error) {
        console.error("Error al obtener el saldo del usuario:", error);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="w-full m-0 p-0">
      <div className="w-full m-0 p-0 flex justify-center">
        <div className="w-full max-w-md m-0 p-0 mx-auto">
          <div className="w-full m-0 p-0">
            <div className="aspect-[1.58/1] rounded-lg overflow-hidden bg-blue-600 relative shadow-md">
              {/* Patrón de cuadrados en el fondo */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="bg-blue-600"></div>
                <div className="bg-blue-700"></div>
                <div className="bg-blue-700"></div>
                <div className="bg-blue-800"></div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="text-white text-2xl font-bold tracking-wider">Visa Empresarial</div>

                {/* Número de tarjeta */}
                <div className="text-white tracking-wider text-2xl font-mono mt-8">**** **** **** 9010</div>

                <div className="flex flex-col md:mt-4">
                  <div className="text-sm text-white">VÁLIDO HASTA 12/25</div>
                  <div className="text-white text-sm md:text-lg mt-1">C. ARIAS</div>
                  <div className="text-white text-sm md:text-lg">NOMBRE DE EMPRESA</div>
                </div>

                <div className="absolute bottom-6 right-6 text-white text-3xl font-bold">VISA</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-500">Tarjeta terminada en 9010</p>
            <p className="text-gray-500">Expira: 12/25</p>
          </div>

          {/* User Balance Section */}
          <div className="mt-6 text-center">
            {loadingBalance ? (
              <p className="text-gray-500">Cargando saldo...</p>
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                Saldo disponible: <span className="text-green-600">{balance?.toFixed(2)} BOB</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

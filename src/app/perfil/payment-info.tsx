import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import Saldo from "./saldo/saldo";

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
    <div className="w-full">
      <Saldo/>
      <div className="w-full m-0 p-0 flex justify-center">
        <div className="mt-6 text-center">
          {loadingBalance ? (
            <p className="text-gray-500">Cargando saldo...</p>
          ) : (
            <p className="text-lg font-semibold text-gray-800">
              Saldo disponible:{" "}
              <span className="text-green-600">{balance?.toFixed(2)} BOB</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

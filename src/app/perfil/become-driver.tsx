import { useEffect, useState } from "react";
import Pendiente from "./driver/pendiente";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { Licencia, LicenciaConducir } from "./driver/licencia";
import { SolicitarLicencia } from "./driver/soliciar-licencis";

export function BecomeDriver() {
  const [licencia, setLicencia] = useState<Licencia | null>(null);
  const [estado, setEstado] = useState("NO_REQUESTED");
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      try {
        if (localStorage.getItem("estadoConductor") === "APPROVED") {
          const res = await axios.get<Licencia>(`${API_URL}/api/licencia`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (res.status === 200) {
            setLicencia(res.data);
          }
        }
      } catch (error) {
        console.error("Error fetching driver license:", error);
        setLicencia(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const state = localStorage.getItem("estadoConductor");
    if (state) {
      setEstado(state);
    }
    getData();
  }, []);

  return (
    <>
      {loading && (
        <div className="flex flex-col justify-center items-center text-gray-500">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 m-4 "></div>
          Cargando...
        </div>
      )}
      {estado === "NO_REQUESTED" && <SolicitarLicencia />}
      {licencia && (
        <div className="w-full flex flex-col items-center mx-auto mt-8 space-y-6">
          <p className="text-gray-500 text-center">
            ¡Felicidades! Usted ha sido verficado como Conductor.
          </p>
          <LicenciaConducir data={licencia} />
        </div>
      )}
      {estado === "PENDING" && <Pendiente />}
    </>
  );
}

import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";
import { RawAuto_Interface_Recode as RawAuto } from "@/interface/RawAuto_Interface_Recode";
import { getAllCars } from "@/service/services_Recode";
import { transformAuto } from "@/utils/transformAuto_Recode";

export function useAutosSimplificado() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [cargando, setCargando] = useState(true);

  const fetchAutos = async () => {
    try {
      setCargando(true);
      const rawData: RawAuto[] = await getAllCars();
      const transformed = rawData.map(transformAuto);
      setAutos(transformed);
    } catch (error) {
      console.error("Error al cargar los autos:", error);
      alert("No se pudo cargar los autos. Intenta de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAutos();
  }, []);

  return { autos, cargando };
}

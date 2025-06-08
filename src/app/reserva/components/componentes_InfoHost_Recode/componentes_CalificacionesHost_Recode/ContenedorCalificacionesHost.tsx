'use client';

import { useEffect, useState } from "react";
import RatingSummary_Recode from "./RatingSummary_Recode";
import { getCalificacionesHost } from "@/app/reserva/services/services_reserva";

type RatingDistribution = {
  [key: number]: number;
};

const ContenedorCalificacionesHost = ({ id_host }: { id_host: number }) => {
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [distribution, setDistribution] = useState<RatingDistribution>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const data = await getCalificacionesHost(id_host);
        console.log("📊 Datos de calificaciones recibidos:", data);

        if (data && Array.isArray(data)) {
          const newDistribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          let totalSum = 0;

          data.forEach((item: any) => {
            const calificacion = item.calificacion;
            if (calificacion >= 1 && calificacion <= 5) {
              newDistribution[calificacion]++;
              totalSum += calificacion;
            }
          });

          const totalReviews = data.length;
          const avg = totalReviews > 0 ? totalSum / totalReviews : 0;

          setAverage(avg);
          setTotal(totalReviews);
          setDistribution(newDistribution);
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Error al obtener calificaciones:", error);
      }
    };

    fetchData();

    intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [id_host]);

  if (loading) return <p className="text-sm text-gray-600">Cargando calificaciones...</p>;

  return (
    <RatingSummary_Recode
      average={average}
      totalReviews={total}
      distribution={distribution}
    />
  );
};

export default ContenedorCalificacionesHost;

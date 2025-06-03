"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarCardProps } from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { getCarsSeguro } from "@/app/admin/validarSeguro/services/servicesSeguro";
import CarList_Recode from "@/app/admin/validarSeguro/components/ListaAutosSeguros/CarList_Recode";

export function InsurancesManagement() {
  const [carCards, setCarCards] = useState<CarCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const autos = await getCarsSeguro();
      setCarCards(autos);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Seguros de Auto</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-gray-500">Cargando autos...</div>
          ) : carCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-semibold">No hay autos disponibles</h3>
              <p>Actualmente no hay registros para mostrar.</p>
            </div>
          ) : (
            <CarList_Recode carCards={carCards} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
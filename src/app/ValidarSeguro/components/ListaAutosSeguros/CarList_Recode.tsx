"use client";

import { memo, useState } from "react";
import { CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import CarCard_Recode from "./cardAutoSeguro/CarCard_Recode";
import Modal_Recode from "@/app/validarSeguro/components/Seguros/Modal_Recode";
import ListaAseguradoras_Recode from "@/app/validarSeguro/components/Seguros/ListaAseguradoras_Recode";

// Simulamos aseguradoras por auto
const todasAseguradoras = [
  { id: 1, idAuto: 1, empresa: "Seguros A", fechaInicio: "01/01/2023", fechaFin: "01/01/2024" },
  { id: 2, idAuto: 2, empresa: "Seguros B", fechaInicio: "02/02/2023", fechaFin: "02/02/2024" },
  { id: 3, idAuto: 1, empresa: "Seguros C", fechaInicio: "03/03/2023", fechaFin: "03/03/2024" },
  { id: 4, idAuto: 3, empresa: "Seguros D", fechaInicio: "04/04/2023", fechaFin: "04/04/2024" },
  { id: 5, idAuto: 2, empresa: "Seguros E", fechaInicio: "05/05/2023", fechaFin: "05/05/2024" },
  { id: 6, idAuto: 1, empresa: "Seguros F", fechaInicio: "06/06/2023", fechaFin: "06/06/2024" },
  { id: 7, idAuto: 1, empresa: "Seguros G", fechaInicio: "07/07/2023", fechaFin: "07/07/2024" },
  { id: 8, idAuto: 1, empresa: "Seguros H", fechaInicio: "08/08/2023", fechaFin: "08/08/2024" },
  { id: 9, idAuto: 1, empresa: "Seguros I", fechaInicio: "09/09/2023", fechaFin: "09/09/2024" },
];

interface Props {
  carCards: CarCardProps[];
}

function CarList_Recode({ carCards }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(carCards.length / ITEMS_PER_PAGE);

  const currentItems = carCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleVerAseguradoras = (idAuto: number) => {
    setIdSeleccionado(idAuto);
    setIsOpen(true);
  };

  const aseguradorasFiltradas = todasAseguradoras.filter(
    (a) => a.idAuto === idSeleccionado
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Cards */}
      <div className="flex flex-col gap-6 w-full">
        {currentItems.map((car) => (
          <CarCard_Recode
            key={car.idAuto}
            {...car}
            onVerAseguradoras={handleVerAseguradoras}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4 items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &laquo;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>

      {/* Modal aseguradoras */}
      <Modal_Recode
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIdSeleccionado(null);
        }}
        title="Aseguradoras"
      >
        <ListaAseguradoras_Recode aseguradoras={aseguradorasFiltradas} />
      </Modal_Recode>
    </div>
  );
}

export default memo(CarList_Recode);

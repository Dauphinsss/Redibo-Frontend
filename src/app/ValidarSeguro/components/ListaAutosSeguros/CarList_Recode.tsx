"use client";
import { memo, useState } from "react";
import { CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import CarCard_Recode from "./cardAutoSeguro/CarCard_Recode";

interface Props {
  carCards: CarCardProps[];
}

function CarList_Recode({ carCards }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(carCards.length / ITEMS_PER_PAGE);

  const currentItems = carCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Cards */}
      <div className="flex flex-col gap-6 w-full">
        {currentItems.map((car) => (
          <CarCard_Recode key={car.idAuto} {...car} />
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
    </div>
  );
}

export default memo(CarList_Recode);
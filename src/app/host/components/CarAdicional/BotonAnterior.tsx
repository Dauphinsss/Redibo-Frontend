"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BotonAnterior: React.FC = () => {
  return (
    <Link href="/host/home/add/carcoche">
      <Button
        variant="secondary"
        className="
          w-auto               /* ⬅ Ahora el ancho se adapta al contenido */
          sm:w-40              /* ⬅ En pantallas sm+ ocupa 10rem (justo '< Volver') */
          h-10                 /* ⬅ Altura reducida a 2.5rem */
          flex items-center gap-1
          text-base font-medium
          transition-transform duration-200 ease-in-out transform
          hover:scale-105 hover:bg-gray-100 hover:brightness-90
        "
      >
        <ChevronLeft className="h-4 w-4" />
        Volver
      </Button>
    </Link>
  );
};

export default BotonAnterior;

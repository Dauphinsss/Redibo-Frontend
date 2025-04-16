"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react"; // Asegúrate de tener este ícono instalado

const BotonAnterior: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-start">
      <Link href="/host/home/add/carcoche">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>
    </div>
  );
};

export default BotonAnterior;
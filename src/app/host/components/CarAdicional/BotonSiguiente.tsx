"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BotonSiguienteProps {
  redirectTo: string;
}

const BotonSiguiente: React.FC<BotonSiguienteProps> = ({ redirectTo }) => {
  const router = useRouter();

  return (
    <Button
      variant="default"
      className="w-50 h-12 text-lg font-semibold text-white bg-gray-800"
      onClick={() => router.push(redirectTo)}
    >
      SIGUIENTE
    </Button>
  );
};

export default BotonSiguiente;
"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ButtonLimpiarProps {
  onLimpiar: () => void;
  disabled?: boolean;
}

export function ButtonLimpiar({ onLimpiar, disabled }: ButtonLimpiarProps) {
  return (
    <Button 
      variant="outline" 
      className="w-[200px] justify-between"
      onClick={onLimpiar}
      disabled={disabled}
    >
      Limpiar Filtros
      <Trash2 className="ml-2 h-4 w-4" />
    </Button>
  );
} 
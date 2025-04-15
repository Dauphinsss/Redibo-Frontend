"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface BotonesFormularioProps {
  isFormValid: boolean;
}

export default function BotonesFormulario({ isFormValid }: BotonesFormularioProps) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleConfirmExit = () => {
    router.push("/host/pages");
  };

  return (
    <div className="w-full max-w-5xl flex justify-between mt-10 px-100">
      
      <Button
        variant="default"
        className="w-50 h-12 text-lg font-semibold text-white bg-gray-800"
        onClick={() => router.push("/host/home/add/inputimagen")}
        disabled={!isFormValid}
      >
        SIGUIENTE
      </Button>
    </div>
  );
}

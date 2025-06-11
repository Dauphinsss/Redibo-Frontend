"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VehicleUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleUnavailableModal({
  isOpen,
  onClose
}: VehicleUnavailableModalProps) {
  const router = useRouter();

  const handleGoBack = () => {
    onClose();
    router.back();
  };

  const handleChooseAnother = () => {
    onClose();
    router.push('/busqueda');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800 mb-4">
            Error.. Vehículo No Disponible
          </DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <svg
            className="w-20 h-20 text-red-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <p className="text-xl font-normal text-gray-600 mb-6">
            Ups... lo sentimos, el automóvil que ha solicitado ya ha sido reservado/tomado.
          </p>

          <hr className="mb-4" />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleGoBack}>
              Volver Atrás
            </Button>
            <Button variant="default" onClick={handleChooseAnother}>
              Elegir otro auto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
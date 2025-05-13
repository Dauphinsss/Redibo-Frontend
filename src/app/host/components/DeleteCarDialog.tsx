// src/app/host/components/DeleteCarDialog.tsx
import { ReactNode } from "react";
import { Car } from "@/app/host/types";
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

interface DeleteCarDialogProps {
  car: Car;
  onDelete: () => Promise<void>;
  trigger: ReactNode;
}

export function DeleteCarDialog({ car, onDelete, trigger }: DeleteCarDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Confirmar eliminación?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminarás el {car.brand} {car.model} ({car.year})
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
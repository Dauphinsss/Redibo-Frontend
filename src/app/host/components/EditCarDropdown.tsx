// src/app/host/components/EditCarDropdown.tsx
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface EditCarDropdownProps {
  carId: number;
}

export function EditCarDropdown({ carId }: EditCarDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          Editar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuItem
          onClick={() => router.push(`/host/home/editar/Dir/${carId}`)}
        >
          Dirección
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/host/home/editar/DatosPrincipales/${carId}`)}
        >
          Datos principales
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/host/home/editar/Caraccocheedit/${carId}`)}
        >
          Características del coche
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/host/home/editar/CarAdd/${carId}`)}
        >
          Características adicionales
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/host/home/editar/CarIma/${carId}`)}
        >
          Imágenes del coche y precio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
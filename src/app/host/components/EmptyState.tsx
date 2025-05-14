// src/app/host/components/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  message?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function EmptyState({
  message = "No se encontraron carros",
  buttonText = "Crear primer carro",
  buttonUrl = "/host/home/add/direccion"
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <h3 className="text-center text-2xl font-semibold my-8">
        {message}
      </h3>
      <Button onClick={() => router.push(buttonUrl)}>
        {buttonText}
      </Button>
    </div>
  );
}
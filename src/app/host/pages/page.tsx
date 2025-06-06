// src/app/host/pages/ViewCarsPage.tsx
"use client";

import Header from "@/components/ui/Header";
import { useCars } from "../hooks/useCars";
import { useCarImages, CarImage } from "@/app/host/hooks/useCarImages";
import { CarList } from "../components/CarList";
import { EmptyState } from "@/app/host/components/EmptyState";
import { API_URL } from "@/utils/bakend";
import { useState, useEffect } from "react";

export default function ViewCarsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUserError("No hay sesión activa.");
      setUserLoading(false);
      return;
    }

    const fetchUserId = async () => {
      try {
        const response = await fetch(`${API_URL}/api/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
        } else {
          setUserError("Error al obtener información del usuario.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setUserError("Error de conexión al obtener datos del usuario.");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const {
    cars,
    hasMore,
    loading: carsLoading,
    error: carsError,
    fetchMoreData,
    deleteCar,
  } = useCars({ hostId: userId });

  const {
    carImages,
    loading: imagesLoading,
    error: imagesError,
  } = useCarImages(cars);

  if (carsLoading || userLoading) {
    return <h3 className="text-center p-4">Cargando carros...</h3>;
  }

  if (carsError || userError) {
    return (
      <h3 className="text-center p-4 text-red-500">
        {carsError ? carsError.message : userError}
      </h3>
    );
  }

  if (!carsLoading && cars.length === 0) {
    return <EmptyState />;
  }

  const handleDelete = async (carId: number) => {
    try {
      await deleteCar(carId);
      alert("Vehículo eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el vehículo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fixed at top with white background */}
      <div className="fixed top-0 left-0 w-full z-20 bg-white shadow">
        <Header />
      </div>

      {/* Main content with padding to avoid header overlap */}
      <main className="pt-20 p-6 flex flex-col items-center">
        {imagesLoading && (
          <p className="text-center p-2">Cargando imágenes...</p>
        )}
        {imagesError && (
          <p className="text-center p-2 text-red-500">
            Error cargando imágenes: {imagesError.message}
          </p>
        )}

        <CarList
          cars={cars}
          carImages={carImages as Record<number, CarImage[]>}
          hasMore={hasMore}
          fetchMoreData={fetchMoreData}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}

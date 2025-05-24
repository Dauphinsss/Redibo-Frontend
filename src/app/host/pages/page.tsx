// src/app/host/pages/ViewCarsPage.tsx
"use client";

import Header from "@/components/ui/Header";
import { useCars } from "../hooks/useCars";
import { useCarImages, CarImage } from "@/app/host/hooks/useCarImages";
import { CarList } from "../components/CarList";
import { EmptyState } from "@/app/host/components/EmptyState";

export default function ViewCarsPage() {
  const {
    cars,
    hasMore,
    loading: carsLoading,
    error: carsError,
    fetchMoreData,
    deleteCar,
  } = useCars({ hostId: 1 });

  const {
    carImages,
    loading: imagesLoading,
    error: imagesError,
  } = useCarImages(cars);

  if (carsLoading) {
    return <h3 className="text-center p-4">Cargando carros...</h3>;
  }

  if (carsError) {
    return (
      <h3 className="text-center p-4 text-red-500">
        Error cargando vehículos: {carsError.message}
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

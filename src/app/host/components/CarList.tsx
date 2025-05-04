// src/app/host/components/CarList.tsx

import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Car } from "@/app/host/types";
import { CarImage } from "@/app/host/hooks/useCarImages";
import { CarCard } from "./CarCard";

interface CarListProps {
  cars: Car[];
  carImages: Record<number, CarImage[]>;
  hasMore: boolean;
  fetchMoreData: () => Promise<void>;
  handleDelete: (carId: number) => Promise<void>;
}

export function CarList({
  cars,
  carImages,
  hasMore,
  fetchMoreData,
  handleDelete,
}: CarListProps) {
  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-4xl font-bold text-center my-8">Mis Carros</h1>

      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-medium order-1">Lista de carros</span>
        <Link href="/host/home/add/direccion" className="order-2">
          <Button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer">
            <Plus size={20} /> Añadir
          </Button>
        </Link>
      </div>

      <Separator className="my-4" />

      <InfiniteScroll
        dataLength={cars.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center p-4">Cargando más carros...</h4>}
        className="space-y-4"
      >
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            images={carImages[car.id] || []}
            onDelete={handleDelete}
          />
        ))}
      </InfiniteScroll>

      {!hasMore && cars.length > 0 && (
        <p className="text-center text-gray-500 mt-6">
          No hay más autos para mostrar
        </p>
      )}
    </div>
  );
}

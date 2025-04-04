"use client";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
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

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  image: string;
}

const mockCars: Car[] = [
  { id: 1, brand: "Toyota", model: "Supra", year: 2023, price: 150, status: "Disponible", image: "/cars/supra.png" },
  { id: 2, brand: "Mazda", model: "CX-5", year: 2024, price: 80, status: "Rentado", image: "/cars/mazda.png" },
  { id: 3, brand: "Mercedes-Benz", model: "Clase C", year: 2024, price: 120, status: "Disponible", image: "/cars/mercedez.png" },
];

export default function ViewCarsPage() {
  const [cars, setCars] = useState<Car[]>(mockCars.slice(0, 2));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    setTimeout(() => {
      setCars(prev => {
        const nextIndex = prev.length;
        if (nextIndex >= mockCars.length) {
          setHasMore(false);
          return prev;
        }
        return [...prev, mockCars[nextIndex]];
      });
    }, 1000);
  };

  const handleDelete = (carId: number) => {
    setCars(prev => prev.filter(c => c.id !== carId));
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center my-8">Mis Carros</h1>

        <div className="flex items-center justify-between mb-4">
          <Button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Añadir Carro
          </Button>
          <span className="text-lg font-medium">Lista de carros</span>
        </div>

        <Separator className="my-4" />

        <InfiniteScroll
          dataLength={cars.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-center p-4">Cargando...</h4>}
          className="space-y-4"
        >
          {cars.map((car) => (
            <Card
              key={car.id}
              className="flex flex-col md:flex-row shadow-lg border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
            >
              <CardHeader className="p-0 md:w-1/3">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="object-cover w-full h-48 md:h-full"
                  loading="lazy"
                />
              </CardHeader>

              <CardContent className="md:w-2/3 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">Año: {car.year}</p>
                  </div>
                  <Badge variant={car.status === "Disponible" ? "default" : "destructive"}>
                    {car.status}
                  </Badge>
                </div>
                <p className="text-lg font-semibold">${car.price}/día</p>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full gap-2">
                        <Trash2 size={18} /> Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás por eliminar el {car.brand} {car.model} ({car.year})
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(car.id)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </InfiniteScroll>

        {!hasMore && (
          <p className="text-center text-gray-500 mt-6">
            No hay más autos para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}

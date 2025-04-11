"use client";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  image: string;
  vin: string;
  plate: string;
}

const mockCars: Car[] = [
  {
    id: 1,
    brand: "Toyotooo",
    model: "Supra",
    year: 2023,
    price: 150,
    status: "Disponible",
    image: "/cars/supra.png",
    vin: "JH4KA8260MC000001",
    plate: "1234-ABC"
  },
  {
    id: 2,
    brand: "Mazda",
    model: "CX-5",
    year: 2024,
    price: 80,
    status: "Rentado",
    image: "/cars/mazda.png",
    vin: "JM3KFBDM0M0100002",
    plate: "5678-XYZ"
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
    model: "Clase C",
    year: 2024,
    price: 120,
    status: "Disponible",
    image: "/cars/mercedez.png",
    vin: "WDDWF4JB1KR000003",
    plate: "9101-MNO"
  }
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
  const router = useRouter();
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
          <header className="border-b w-full">
            <div className="flex h-12 items-center justify-between pl-2 md:pl-2 mt-[-10px]">
              <div className="font-bold text-xl mt-[-20px]">
                <Link href="/">REDIBO</Link>
              </div>
              <div className="mr-2 pointer-events-none">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center my-8">Mis Carros</h1>
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-medium order-1">Lista de carros</span>
          <Button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 order-2"
          onClick={() => router.push("/host/home/add")}
          >
            <Plus size={20} /> Añadir
          </Button>
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
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                  <div className="text-sm text-muted-foreground flex flex-col gap-1">
                    <p>Año: {car.year}</p>
                    <p className="break-all">VIN: {car.vin}</p>
                    <p>Placa: {car.plate}</p>
                  </div>
                </div>

                <Badge variant={car.status === "Disponible" ? "default" : "destructive"}>
                  {car.status}
                </Badge>
              </div>

                <p className="text-lg font-semibold">BS {car.price}/día</p>

                <div className="flex flex-col gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Editar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => router.push(`/host/home/editar/Dir/pages`)}>
                        Dirección
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`home/editar/DatosPrincipales/pages`)}>
                        Datos principales
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/host/home/editar/Caraccocheedit/pages`)}>
                        Características del coche
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/host/home/editar/CarAdd/pages`)}>
                        Características adicionales
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/host/home/editar/imagenes/${car.id}`)}>
                        Imágenes del coche
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

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

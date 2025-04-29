"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
//import { header} from "@/components/ui/Header";
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
import { getCars, Car } from "@/app/host/services/carService";
import { getImagesByCarId, Image } from "@/app/host/services/imageService";

export default function ViewCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  //const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [carImages, setCarImages] = useState<{ [key: number]: Image[] }>({});

  useEffect(() => {
    async function loadInitialCars() {
      try {
        const result = await getCars({ skip: 0, take: 10, hostId: 1 });
        setCars(result.data);
        //setTotal(result.total);
        setHasMore(result.data.length > 0 && result.data.length < result.total);
        setSkip(result.data.length);
      } catch (error) {
        console.error("Error al cargar carros:", error);
        alert("¡Error cargando datos!");
      } finally {
        setLoading(false);
      }
    }
    loadInitialCars();
  }, []);

  useEffect(() => {
    async function loadImages() {
      const imagesByCar: { [key: number]: Image[] } = {};
      await Promise.all(
        cars.map(async (car) => {
          try {
            const imagesResponse = await getImagesByCarId(car.id);
            imagesByCar[car.id] = imagesResponse.data;
          } catch (error) {
            console.error(`Error al cargar imagen para el carro ${car.id}:`, error);
            imagesByCar[car.id] = [];
          }
        })
      );
      setCarImages(imagesByCar);
    }
    if (cars.length > 0) {
      loadImages();
    }
  }, [cars]);

  const fetchMoreData = async () => {
    try {
      const result = await getCars({ skip, take: 10, hostId: 1 });
      setCars((prev) => [...prev, ...result.data]);
      setSkip((prev) => prev + result.data.length);
      setHasMore(cars.length + result.data.length < result.total);
    } catch (error) {
      console.error("Error al cargar más carros:", error);
    }
  };

  const handleDelete = async (carId: number) => {
    try {
      // Llamada a la API para eliminar el vehículo
      await axios.delete(`https://redibo-backend-sprinteros1.onrender.com/api/vehiculo/${carId}`); 
      // Una vez eliminado correctamente, actualizamos el estado local
      setCars((prev) => prev.filter((car) => car.id !== carId));
      // Opcional: Mostrar mensaje de éxito
      alert("Vehículo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      alert("Error al eliminar el vehículo");
    }
  };

  if (loading) {
    return <h3 className="text-center p-4">Cargando carros...</h3>;
  }

  if (!loading && cars.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
        <h3 className="text-center text-2xl font-semibold my-8">
          No se encontraron carros
        </h3>
        <Button onClick={() => router.push("/host/home/add/direccion")}>
          Crear primer carro
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <Header
        forceLoggedInView={true} // Criterio 2: Siempre muestra la vista de logueado
        disableInteractions={true} // Criterio 1: Deshabilita interacciones (excepto logo)
                                  // Criterio 3 (Logo activo): Se maneja dentro de Header.tsx
      />
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
            <Card
              key={car.id}
              className="flex flex-col md:flex-row shadow-lg border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
            >
              <CardHeader className="p-0 md:w-1/3">
                {carImages[car.id] && carImages[car.id].length > 0 ? (
                  <img
                    src={`data:image/jpeg;base64,${carImages[car.id][1].data}`}
                    alt={`${car.brand} ${car.model}`}
                    className="object-cover w-full h-48 md:h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-48 md:h-full bg-gray-200">
                    <p>No image available</p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="md:w-2/3 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">
                      {car.brand} {car.model}
                    </h3>
                    <div className="text-sm text-muted-foreground flex flex-col gap-1">
                      <p>Año: {car.year}</p>
                      <p className="break-all">VIN: {car.vin}</p>
                      <p>Placa: {car.plate}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      car.status === "Disponible" ? "default" : "default"
                    }
                  >
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
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/host/home/editar/Dir/${car.id}`)
                        }
                      >
                        Dirección
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/host/home/editar/DatosPrincipales/${car.id}`)
                        }
                      >
                        Datos principales
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/host/home/editar/Caraccocheedit/${car.id}`)
                        }
                      >
                        Características del coche
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/host/home/editar/CarAdd/${car.id}`)
                        }
                      >
                        Características adicionales
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/host/home/editar/imagenes/${car.id}`)
                        }
                        disabled // Agrega esta propiedad para bloquear el botón
                      >
                        Imágenes del coche
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full gap-2"
                      >
                        <Trash2 size={18} /> Eliminar
                      </Button>
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
                        <AlertDialogAction
                          onClick={() => handleDelete(car.id)}
                        >
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

        {!hasMore && cars.length > 0 && ( // Condición añadida para no mostrar si no hay carros
          <p className="text-center text-gray-500 mt-6">
            No hay más autos para mostrar
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

export default function CarListView() {
  // Datos simulados
  const [cars] = useState<Car[]>([
    { id: 1, brand: "Toyota", model: "Corolla", year: 2020, price: 50, status: "Disponible" },
    { id: 2, brand: "Honda", model: "Civic", year: 2019, price: 45, status: "En uso" },
    { id: 3, brand: "Ford", model: "Focus", year: 2021, price: 55, status: "Disponible" },
  ]);

  return (
    <div className="space-y-4">
      {cars.length > 0 ? (
        cars.map((car) => (
          <div
            key={car.id}
            className="border p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{car.brand} {car.model} ({car.year})</h2>
              <p className="text-gray-600">Estado: {car.status}</p>
              <p className="text-gray-600">Precio por día: ${car.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No tienes autos registrados.</p>
      )}
    </div>
  );
}


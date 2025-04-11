"use client";

interface CarCardProps {
  name: string;
  price: string;
  rating: number;
}

export default function CarCard({ name, price, rating }: CarCardProps) {
  return (
    <div className="flex gap-4 border rounded p-4 mb-4">
      <div className="w-32 h-24 bg-gray-300 rounded"></div>
      <div className="flex-1">
        <h2 className="font-bold text-lg">{name}</h2>
        <p className="text-sm">⭐ {rating} / 10</p>
        <p className="text-sm text-gray-700">{price} por día</p>
        <button className="mt-2 bg-black text-white px-4 py-1 rounded">Reservar</button>
      </div>
    </div>
  );
}

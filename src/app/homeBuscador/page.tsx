import RecodeCarList from "@/components/recodeComponentes/RecodeCarList";
import {cars} from "@/Datos de prueba/cars"

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 md:p-24">
          <h1 className="text-2xl font-bold mb-4">Autos disponibles</h1>
          <RecodeCarList carCards={cars} />

      </main>
    </div>
  );
}
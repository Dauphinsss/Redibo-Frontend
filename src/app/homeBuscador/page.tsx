import Header from "@/components/ui/Header";
import CarCard from "@/components/recodeComponentes/RecodeCarCard";

export default function Home() {
  return (
    <div>
      <Header />  
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 md:p-24">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenido a REDIBO</h1>
          <CarCard
            nombre="Toyota Corolla"
            marca="Toyota"
            asientos={5}
            puertas={4}
            transmision="Automática"
            combustible="Gasolina"
            estado="Disponible"
            nombreHost="Carlos"
            calificacion={9.8}
            ubicacion="Cochabamba"
            precioOficial="99,99$"
            precioDescuento="99,99$"
            precioPorDia="100$"
          />

        </main>
    </div>
  );
}
import Header from "@/components/ui/Header";
import CarCard from "@/components/uiHome/CarCard";

export default function Home() {
  return (
    <div>
      <Header />  
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 md:p-24">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenido a REDIBO</h1>
          <CarCard name="hola" price="99.9$" rating={9.9}/>
        </main>
    </div>
  );
}
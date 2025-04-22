import Carrucel from "@/components/custom/Carrucel";
import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/searchbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-8 sm:px-6 md:px-12 lg:px-24">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
          Bienvenido a REDIBO
        </h1>
        <p className="mt-4 text-base sm:text-lg text-center max-w-xl">
          Tu tienda en línea para rentar autos.
        </p>
        <div className="mt-8 w-full max-w-7xl flex justify-center">
          <Carrucel />
        </div>
      </main>
    </div>
  );
}

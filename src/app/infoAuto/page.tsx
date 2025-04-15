import Header from "@/components/ui/Header";

export default function Home() {
  
  return (
    <div>
      <Header />  
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 md:p-24">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenido a REDIBO</h1>
        </main>
    </div>
  );
}
import { CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import CarList_Recode from "../components/ListaAutosSeguros/CarList_Recode";

export default function Page() {
    const carCards: CarCardProps[] = Array.from({ length: 8 }, (_, i) => ({
            idAuto: ""+i + 1,
            modelo: `Modelo ${i + 1}`,
            marca: `Marca del auto ${i + 1}`,
            asientos: 5 + (i % 3),
            puertas: 4,
            transmision: i % 2 === 0 ? "Automática" : "Manual",
            combustibles: ["Gasolina", "Gas", "Diesel", "Eléctrico"],
            host: `Host ${i + 1}`,
            ubicacion: `Ciudad ${i + 1}, Calle ${i + 1}`,
            src: `/public/images/Auto_default.png`,
            alt: `Imagen del auto ${i + 1}`
        }));
    return (
        <main className="min-h-screen p-8 bg-white">
            <h1 className="text-2xl font-bold text-center mb-6">Lista de autos</h1>
            <CarList_Recode carCards={carCards} />
        </main>
    );
}

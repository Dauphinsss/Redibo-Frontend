import CarCard_Recode from "@/app/validarSeguro/components/ListaAutosSeguros/cardAutoSeguro/CarCard_Recode";
export default function Page() {
    return (
        <main className="min-h-screen flex items-center justify-center p-8">
            <CarCard_Recode 
                modelo="Model"
                marca="Marca"
                asientos={5}
                puertas={4}
                transmision="Automática"
                combustibles={["Eléctrico", "Gasolina", "Gas", "Diesel"]}
                host="John Doe"
                ubicacion="San Francisco, CA"
                src="/images/Auto_default.png"
                alt="Auto Tesla Model S"
            />
        </main>
    );
}

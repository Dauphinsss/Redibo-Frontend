import React from "react";
import CarImage_Recode from "./CarImage_Recode";
import CarButton_Recode from "./CarButton_Recode";
import CarDetails_Recode from "./CarDetails_Recode";

const CarCard_Recode: React.FC = () => {
    return (
        <div className="border p-4 rounded-xl flex gap-6 max-w-4xl shadow-sm items-center">
            <CarImage_Recode />
            <div className="flex flex-col justify-between h-full">
                <CarDetails_Recode
                    modelo="Modelo"
                    marca="Marca del auto"
                    asientos={9}
                    puertas={9}
                    transmision="Automática"
                    combustibles={["Gasolina", "Gas", "Diesel", "Eléctrico"]}
                    host="Nombre del Host"
                    ubicacion="Ciudad, Calle"
                />
                <CarButton_Recode />
            </div>
        </div>
    );
};

export default CarCard_Recode;

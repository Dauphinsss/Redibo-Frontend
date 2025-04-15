"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
Select,
SelectTrigger,
SelectValue,
SelectContent,
SelectGroup,
SelectItem,
} from "@/components/ui/select";
import axios from 'axios';

// URL base de la API
const API_URL = "http://localhost:4000/api";

// Interfaz para el formulario
interface CarFormData {
brand: string;
model: string;
year: string;
vin: string;
plate: string;
}

// Años disponibles para el selector
const years = Array.from({ length: 11 }, (_, i) => {
const year = 2025 - i;
return { label: year.toString(), value: year.toString() };
});

export default function DatosPrincipales() {
const router = useRouter();
const params = useParams();
  // Extraemos el ID del carro de los parámetros de la URL
const carId = params?.id ? parseInt(params.id as string) : null;

const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: "",
    vin: "",
    plate: ""
});

const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  // Cargar datos del vehículo
useEffect(() => {
    const fetchCarData = async () => {
    if (!carId) {
        setIsLoading(false);
        setError("ID del vehículo no encontrado");
        return;
    }

    try {
        // Intentamos con el endpoint de vehículo completo
        const response = await axios.get(`${API_URL}/vehiculo/${carId}`);
        
        if (response.data) {
          // Intentamos acceder a los datos del vehículo dependiendo de la estructura
        let vehiculoData = response.data;
        
          // Si los datos están dentro de una propiedad 'data'
        if (response.data.data) {
            vehiculoData = response.data.data;
        }
        
          // Actualizar formulario con los datos recibidos
        setFormData({
            brand: vehiculoData.marca || "",
            model: vehiculoData.modelo || "",
            year: vehiculoData.año?.toString() || "",
            vin: vehiculoData.vim || "",
            plate: vehiculoData.placa || ""
        });
        } else {
        setError("No se pudo cargar la información del vehículo");
        }
    } catch (err) {
        // Intentar con endpoints individuales si el completo falla
        try {
          // Intentamos cargar cada dato individualmente
        const [marcaResp, modeloResp, anioResp, vimResp, placaResp] = await Promise.all([
            axios.get(`${API_URL}/vehiculo/${carId}/marca`).catch(e => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/modelo`).catch(e => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/anio`).catch(e => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/vim`).catch(e => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/placa`).catch(e => ({ data: "" }))
        ]);
        
          // Actualizar formulario con los datos individuales
        setFormData({
            brand: typeof marcaResp.data === 'object' ? marcaResp.data.marca || "" : marcaResp.data || "",
            model: typeof modeloResp.data === 'object' ? modeloResp.data.modelo || "" : modeloResp.data || "",
            year: typeof anioResp.data === 'object' ? anioResp.data.año?.toString() || "" : anioResp.data?.toString() || "",
            vin: typeof vimResp.data === 'object' ? vimResp.data.vim || "" : vimResp.data || "",
            plate: typeof placaResp.data === 'object' ? placaResp.data.placa || "" : placaResp.data || ""
        });
        
        } catch (err2) {
        setError("Error al cargar los datos del vehículo");
        }
    } finally {
        setIsLoading(false);
    }
    };

    fetchCarData();
}, [carId]);

const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
    ...prev,
    [field]: value
    }));
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carId) {
    setError("ID del vehículo no encontrado");
    return;
    }
    
    try {
    setIsLoading(true);
    
      // Transformar datos del formulario al formato del backend
    const backendData = {
        marca: formData.brand,
        modelo: formData.model,
        año: parseInt(formData.year),
        vim: formData.vin,
        placa: formData.plate
    };
    
      // Actualizar datos en el backend
    const response = await axios.put(`${API_URL}/vehiculo/${carId}`, backendData);
    
    if (response.status === 200 || response.data?.success) {
        // Redireccionar a la página de detalles o lista
        router.push("/host/cars");
    } else {
        setError("No se pudieron guardar los cambios");
    }
    } catch (err) {
    setError("Error al guardar los cambios");
    } finally {
    setIsLoading(false);
    }
};

const handleCancel = () => {
    router.push("/host/cars");
};

if (isLoading) {
    return (
    <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando datos del vehículo...</p>
    </div>
    );
}

return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Título */}
    <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Datos principales</h1>
    </div>

    <span className="text-lg font-medium pl-9 mb-6">Actualice los datos principales del vehículo</span>

      {/* Mensaje de error si existe */}
    {error && (
        <div className="w-full max-w-5xl mb-6 pl-9">
        <p className="text-red-500">{error}</p>
        </div>
    )}

      {/* Formulario */}
    <form onSubmit={handleSubmit} className="w-full max-w-5xl pl-13">
        {/* Número de VIN */}
        <div className="w-full flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Número de VIN</label>
        <Input
            type="text"
            value={formData.vin}
            onChange={(e) => handleChange("vin", e.target.value)}
            placeholder="Introducir Número VIN"
            className="w-[600px] mt-2 border-2 border-black rounded-md"
        />
        </div>

        {/* Año del coche */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Año del coche</label>
        <Select
            value={formData.year}
            onValueChange={(value) => handleChange("year", value)}
        >
            <SelectTrigger className="w-[600px] mt-2 border-2 border-black rounded-md">
            <SelectValue placeholder="Seleccione el año" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                    {year.label}
                </SelectItem>
                ))}
            </SelectGroup>
            </SelectContent>
        </Select>
        </div>

        {/* Marca */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Marca</label>
        <Input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="Introducir marca"
            className="w-[600px] mt-2 border-2 border-black rounded-md"
        />
        </div>

        {/* Modelo */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Modelo</label>
        <Input
            type="text"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            placeholder="Introducir modelo"
            className="w-[600px] mt-2 border-2 border-black rounded-md"
        />
        </div>

        {/* Placa */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Placa</label>
        <Input
            type="text"
            value={formData.plate}
            onChange={(e) => handleChange("plate", e.target.value)}
            placeholder="Introducir placa"
            className="w-[600px] mt-2 border-2 border-black rounded-md"
        />
        </div>

        {/* Sección de Botones */}
        <div className="w-full flex justify-between items-center mt-10">
        <Button 
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
            disabled={isLoading}
        >
            CANCELAR
        </Button>
        
        <Button 
            type="submit"
            variant="default"
            className="h-12 text-lg font-semibold text-white px-6"
            disabled={isLoading}
        >
            {isLoading ? "GUARDANDO..." : "FINALIZAR EDICIÓN Y GUARDAR"}
        </Button>
        </div>
    </form>
    </div>
);
}
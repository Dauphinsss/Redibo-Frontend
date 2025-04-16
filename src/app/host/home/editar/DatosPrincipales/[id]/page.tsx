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
import { toast } from "react-hot-toast"; // Añade esta librería para notificaciones

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
const [isSaving, setIsSaving] = useState(false);
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
        
          // Si los datos están dentro de una propiedad 'vehiculo'
        if (response.data.vehiculo) {
            vehiculoData = response.data.vehiculo;
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
        console.error("Error al cargar datos individuales:", err2);
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
    // Limpiar errores al hacer cambios
    setError(null);
};

  // Validar formulario antes de enviar
const validateForm = (): boolean => {
    // Validar que los campos obligatorios no estén vacíos
    if (!formData.brand.trim()) {
    setError("La marca del vehículo es obligatoria");
    return false;
    }
    if (!formData.model.trim()) {
    setError("El modelo del vehículo es obligatorio");
    return false;
    }
    if (!formData.year) {
    setError("El año del vehículo es obligatorio");
    return false;
    }
    if (!formData.plate.trim()) {
    setError("La placa del vehículo es obligatoria");
    return false;
    }
    if (!formData.vin.trim()) {
    setError("El número VIN del vehículo es obligatorio");
    return false;
    }
    
    return true;
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carId) {
    setError("ID del vehículo no encontrado");
    return;
    }
    // Validar formulario
    if (!validateForm()) {
    return;
    }
    try {
    setIsSaving(true);
    setError(null);
      // Transformar datos del formulario al formato del backend
    const backendData = {
        vim: formData.vin,       // Cambio de "vin" a "vim" para coincidir con el backend
        año: parseInt(formData.year),  // Usando "año" en español como espera el backend
        marca: formData.brand,
        modelo: formData.model,
        placa: formData.plate
    };
    
      // URL actualizada según la captura de Postman
    const response = await axios.put(`${API_URL}/vehiculo/${carId}`, backendData);
    
      if (response.status === 200 || response.data?.mensaje) {  // Verificando "mensaje" en lugar de "success"
        // Mostrar notificación de éxito
        if (typeof toast !== 'undefined') {
        toast.success(response.data.mensaje || "¡Datos guardados correctamente!");
        } else {
        alert(response.data.mensaje || "¡Datos guardados correctamente!");
        }
        
        // Redireccionar a la página de detalles o lista después de un breve retraso
        setTimeout(() => {
        router.push("/host/pages");
        }, 1000);
    } else {
        setError("No se pudieron guardar los cambios. Por favor, inténtelo de nuevo.");
    }
    } catch (err: any) {
    console.error("Error al guardar cambios:", err);
    setError(err.response?.data?.mensaje || "Error al guardar los cambios. Verifique la conexión con el servidor.");
    } finally {
    setIsSaving(false);
    }
};

const handleCancel = () => {
    // Preguntar si hay cambios sin guardar
    if (
    formData.brand !== "" ||
    formData.model !== "" ||
    formData.year !== "" ||
    formData.vin !== "" ||
    formData.plate !== ""
    ) {
    if (window.confirm("¿Está seguro que desea cancelar? Los cambios no guardados se perderán.")) {
        router.push("/host/pages");
    }
    } else {
    router.push("/host/cars");
    }
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
            className={`w-[600px] mt-2 border-2 ${error && !formData.vin ? 'border-red-500' : 'border-black'} rounded-md`}
            required
        />
        </div>

        {/* Año del coche */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Año del coche</label>
        <Select
            value={formData.year}
            onValueChange={(value) => handleChange("year", value)}
        >
            <SelectTrigger className={`w-[600px] mt-2 border-2 ${error && !formData.year ? 'border-red-500' : 'border-black'} rounded-md`}>
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
            className={`w-[600px] mt-2 border-2 ${error && !formData.brand ? 'border-red-500' : 'border-black'} rounded-md`}
            required
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
            className={`w-[600px] mt-2 border-2 ${error && !formData.model ? 'border-red-500' : 'border-black'} rounded-md`}
            required
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
            className={`w-[600px] mt-2 border-2 ${error && !formData.plate ? 'border-red-500' : 'border-black'} rounded-md`}
            required
        />
        </div>

        {/* Sección de Botones */}
        <div className="w-full flex justify-between items-center mt-10">
        <Button 
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
            disabled={isLoading || isSaving}
        >
            CANCELAR
        </Button>
        
        <Button 
            type="submit"
            variant="default"
            className="h-12 text-lg font-semibold text-white px-6"
            disabled={isLoading || isSaving}
        >
            {isSaving ? "GUARDANDO..." : "FINALIZAR EDICIÓN Y GUARDAR"}
        </Button>
        </div>
    </form>
    </div>
);
}
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const API_URL = "http://localhost:4000/api";

interface Option {
  id: number;
  nombre: string;
}

const EditarDireccionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  // Obtener el ID del carro de los parámetros de la URL
  const carId = params?.id ? parseInt(params.id as string) : null;

  const [paises, setPaises] = useState<Option[]>([]);
  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [provincias, setProvincias] = useState<Option[]>([]);

  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedCiudad, setSelectedCiudad] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [calle, setCalle] = useState<string>("");
  const [numCasa, setNumCasa] = useState<string>("");
  const [numCasaError, setNumCasaError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [nombrePais, setNombrePais] = useState<string>("");
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [nombreProvincia, setNombreProvincia] = useState<string>("");
  
  // Debug: mostrar estado actual
  useEffect(() => {
    console.log("Estado actual:", {
      carId,
      selectedPais,
      selectedCiudad,
      selectedProvincia,
      calle,
      numCasa,
      nombrePais,
      nombreCiudad,
      nombreProvincia
    });
  }, [carId, selectedPais, selectedCiudad, selectedProvincia, calle, numCasa, nombrePais, nombreCiudad, nombreProvincia]);

  // 🔹 Cargar datos del carro desde la API específica
  useEffect(() => {
    const fetchCarroConDireccion = async () => {
      if (!carId) {
        setIsLoading(false);
        setError("ID del vehículo no encontrado");
        return;
      }

      try {
        // Debug: mostrar URL de petición
        console.log(`Obteniendo datos de: ${API_URL}/carro/direccion/${carId}`);
        
        // Usar la API con el ID dinámico del carro
        const response = await axios.get(`${API_URL}/carro/direccion/${carId}`);
        const carro = response.data;
        
        // Debug: mostrar respuesta
        console.log("Datos recibidos del API:", carro);

        // Establecer los valores seleccionados
        setSelectedPais(carro.paisId);
        setSelectedCiudad(carro.ciudadId);
        setSelectedProvincia(carro.provinciaId);
        setCalle(carro.calle || "");
        setNumCasa(carro.num_casa || "");

        // Establecer los nombres para mostrar
        setNombrePais(carro.paisNombre || "");
        setNombreCiudad(carro.ciudadNombre || "");
        setNombreProvincia(carro.provinciaNombre || "");

        // Crear las opciones disponibles si vienen en la respuesta
        if (carro.paisesDisponibles) {
          setPaises(carro.paisesDisponibles);
        } else {
          // Crear al menos una opción con el país actual
          if (carro.paisId && carro.paisNombre) {
            setPaises([{ id: carro.paisId, nombre: carro.paisNombre }]);
          }
        }

        if (carro.ciudadesDisponibles) {
          setCiudades(carro.ciudadesDisponibles);
        } else {
          // Crear al menos una opción con la ciudad actual
          if (carro.ciudadId && carro.ciudadNombre) {
            setCiudades([{ id: carro.ciudadId, nombre: carro.ciudadNombre }]);
          }
        }

        if (carro.provinciasDisponibles) {
          setProvincias(carro.provinciasDisponibles);
        } else {
          // Crear al menos una opción con la provincia actual
          if (carro.provinciaId && carro.provinciaNombre) {
            setProvincias([{ id: carro.provinciaId, nombre: carro.provinciaNombre }]);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del vehículo:", err);
        setError("Error al cargar los datos del vehículo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarroConDireccion();
  }, [carId]);

  // Manejador para cuando cambia el país seleccionado
  const handlePaisChange = (value: string) => {
    const paisId = Number(value);
    setSelectedPais(paisId);
    
    // Como estamos limitados a una sola API, reseteamos las selecciones dependientes
    setSelectedCiudad(null);
    setNombreCiudad("");
    setSelectedProvincia(null);
    setNombreProvincia("");
    setCiudades([]);
    setProvincias([]);
    
    // Actualizar el nombre del país seleccionado
    const paisSeleccionado = paises.find(p => p.id === paisId);
    if (paisSeleccionado) {
      setNombrePais(paisSeleccionado.nombre);
    }
    
    // Nota: En una implementación real, aquí haríamos una petición para obtener las ciudades del país
    alert("Para obtener las ciudades de este país, necesitarías consultar la API de ciudades.");
  };

  // Manejador para cuando cambia la ciudad seleccionada
  const handleCiudadChange = (value: string) => {
    const ciudadId = Number(value);
    setSelectedCiudad(ciudadId);
    
    // Reseteamos la provincia
    setSelectedProvincia(null);
    setNombreProvincia("");
    setProvincias([]);
    
    // Actualizar el nombre de la ciudad seleccionada
    const ciudadSeleccionada = ciudades.find(c => c.id === ciudadId);
    if (ciudadSeleccionada) {
      setNombreCiudad(ciudadSeleccionada.nombre);
    }
    
    // Nota: En una implementación real, aquí haríamos una petición para obtener las provincias de la ciudad
    alert("Para obtener las provincias de esta ciudad, necesitarías consultar la API de provincias.");
  };

  // Manejador para cuando cambia la provincia seleccionada
  const handleProvinciaChange = (value: string) => {
    const provinciaId = Number(value);
    setSelectedProvincia(provinciaId);
    
    // Actualizar el nombre de la provincia seleccionada
    const provinciaSeleccionada = provincias.find(p => p.id === provinciaId);
    if (provinciaSeleccionada) {
      setNombreProvincia(provinciaSeleccionada.nombre);
    }
  };

  // Manejador para validar el número de casa (solo números)
  const handleNumCasaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir dígitos
    if (value === '' || /^\d+$/.test(value)) {
      setNumCasa(value);
      setNumCasaError(null);
    } else {
      setNumCasaError("Solo se permiten números");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando datos del vehículo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Validar antes de enviar
  const validarFormulario = (): boolean => {
    // Validar que el número de casa solo contenga números
    if (numCasa && !/^\d+$/.test(numCasa)) {
      setNumCasaError("Solo se permiten números en el número de casa");
      return false;
    }
    
    // Validar campos requeridos
    if (!selectedPais) {
      alert("Debe seleccionar un país");
      return false;
    }
    
    if (!selectedCiudad) {
      alert("Debe seleccionar una ciudad");
      return false;
    }
    
    if (!selectedProvincia) {
      alert("Debe seleccionar una provincia");
      return false;
    }
    
    if (!calle.trim()) {
      alert("La dirección de la calle es obligatoria");
      return false;
    }
    
    if (!numCasa.trim()) {
      alert("El número de casa es obligatorio");
      return false;
    }
    
    return true;
  };

  // Guardar los cambios
  const handleGuardar = async () => {
    if (!carId) {
      alert("ID del vehículo no encontrado");
      return;
    }
    
    // Validar antes de enviar
    if (!validarFormulario()) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    // Preparar los datos para el envío
    // Tomando en cuenta que el API podría esperar los nombres en lugar de IDs
    // similar a cómo se hace en CaracteristicasAdicionalesPage
    const datosParaEnviar = {
      direccion: {
        pais: nombrePais,
        ciudad: nombreCiudad,
        provincia: nombreProvincia,
        calle: calle,
        num_casa: numCasa
      },
      // También enviamos los IDs por si el backend los necesita
      paisId: selectedPais,
      ciudadId: selectedCiudad,
      provinciaId: selectedProvincia
    };
    
    // Debug: mostrar datos a enviar
    console.log("Datos a enviar:", datosParaEnviar);
    console.log(`Enviando a: ${API_URL}/carro/direccion/${carId}`);
    
    try {
      // Intentar con POST como en CaracteristicasAdicionalesPage
      const response = await axios.post(
        `${API_URL}/carro/direccion/${carId}`, 
        datosParaEnviar,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Debug: mostrar respuesta
      console.log("Respuesta del servidor:", response.data);
      
      setSuccessMessage("Dirección actualizada correctamente");
      
      // Redirigir después de un breve retraso para que el usuario vea el mensaje de éxito
      setTimeout(() => router.push("/vehiculos"), 1500);
    } catch (err: any) {
      console.error("Error completo:", err);
      
      // Intentar con PUT si POST falla (por si acaso el endpoint espera PUT)
      try {
        console.log("POST falló, intentando con PUT...");
        
        const responsePut = await axios.put(
          `${API_URL}/carro/direccion/${carId}`, 
          datosParaEnviar,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Respuesta PUT del servidor:", responsePut.data);
        setSuccessMessage("Dirección actualizada correctamente");
        
        // Redirigir después de un breve retraso
        setTimeout(() => router.push("/vehiculos"), 1500);
      } catch (errPut: any) {
        console.error("Error también con PUT:", errPut);
        
        // Extraer mensaje de error detallado si está disponible
        const errorMessage = 
          err.response?.data?.mensaje || 
          err.response?.data?.error || 
          err.message || 
          "Error al guardar los cambios";
        
        setError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold my-5">Dirección</h1>

      {error && (
        <div className="w-full max-w-5xl mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="w-full max-w-5xl mb-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        </div>
      )}

      {/* País */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">País</label>
        <Select
          value={selectedPais?.toString()}
          onValueChange={handlePaisChange}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un país">
              {nombrePais || "Seleccione un país"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {paises.map((pais) => (
                <SelectItem key={pais.id} value={pais.id.toString()}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Ciudad */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Ciudad</label>
        <Select
          value={selectedCiudad?.toString()}
          onValueChange={handleCiudadChange}
          disabled={!selectedPais}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una ciudad">
              {nombreCiudad || "Seleccione una ciudad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                  {ciudad.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Provincia */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Provincia</label>
        <Select
          value={selectedProvincia?.toString()}
          onValueChange={handleProvinciaChange}
          disabled={!selectedCiudad}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una provincia">
              {nombreProvincia || "Seleccione una provincia"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {provincias.map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id.toString()}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Dirección calle */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Dirección de la calle</label>
        <input
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          className="w-[600px] mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Número de casa - Con validación para solo números */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Número de casa</label>
        <input
          type="text"
          value={numCasa}
          onChange={handleNumCasaChange}
          className={`w-[600px] mt-2 p-2 border ${numCasaError ? 'border-red-500' : 'border-gray-300'} rounded`}
          placeholder="Ingrese solo números"
        />
        {numCasaError && (
          <p className="text-red-500 text-sm mt-1">{numCasaError}</p>
        )}
      </div>
      {/* Botón de guardar */}
      <Button 
        onClick={handleGuardar} 
        className="mt-6"
        disabled={isSaving || !!numCasaError}
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
};

export default EditarDireccionPage;
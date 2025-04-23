
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
  
  // Cargar datos iniciales: todos los países y datos del carro
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!carId) {
        setIsLoading(false);
        setError("ID del vehículo no encontrado");
        return;
      }

      try {
        // 1. Cargar todos los países disponibles primero
        try {
          const paisesResponse = await axios.get(`${API_URL}/paises`);
          console.log("Países cargados:", paisesResponse.data);
          if (paisesResponse.data && Array.isArray(paisesResponse.data)) {
            setPaises(paisesResponse.data);
          }
        } catch (err) {
          console.error("Error al cargar países:", err);
          setError("No se pudieron cargar los países disponibles");
        }

        // 2. Obtener datos del carro con dirección
        console.log(`Obteniendo datos de: ${API_URL}/carro/direccion/${carId}`);
        const carroResponse = await axios.get(`${API_URL}/carro/direccion/${carId}`);
        const datosCarro = carroResponse.data;
        
        console.log("Datos recibidos del carro:", datosCarro);

        // Establecer los valores seleccionados
        setSelectedPais(datosCarro.paisId);
        setSelectedCiudad(datosCarro.ciudadId);
        setSelectedProvincia(datosCarro.provinciaId);
        setCalle(datosCarro.calle || "");
        setNumCasa(datosCarro.num_casa || "");

        // Establecer los nombres para mostrar
        setNombrePais(datosCarro.paisNombre || "");
        setNombreCiudad(datosCarro.ciudadNombre || "");
        setNombreProvincia(datosCarro.provinciaNombre || "");

        // 3. Cargar todas las ciudades del país seleccionado
        if (datosCarro.paisId) {
          try {
            const ciudadesResponse = await axios.get(`${API_URL}/ciudades/${datosCarro.paisId}`);
            console.log("Ciudades cargadas:", ciudadesResponse.data);
            if (ciudadesResponse.data && Array.isArray(ciudadesResponse.data)) {
              setCiudades(ciudadesResponse.data);
            }
          } catch (err) {
            console.error("Error al cargar ciudades:", err);
            setCiudades([{ id: datosCarro.ciudadId, nombre: datosCarro.ciudadNombre }]);
          }
        }

        // 4. Cargar todas las provincias de la ciudad seleccionada
        if (datosCarro.ciudadId) {
          try {
            const provinciasResponse = await axios.get(`${API_URL}/provincias/${datosCarro.ciudadId}`);
            console.log("Provincias cargadas:", provinciasResponse.data);
            if (provinciasResponse.data && Array.isArray(provinciasResponse.data)) {
              setProvincias(provinciasResponse.data);
            }
          } catch (err) {
            console.error("Error al cargar provincias:", err);
            setProvincias([{ id: datosCarro.provinciaId, nombre: datosCarro.provinciaNombre }]);
          }
        }

      } catch (err) {
        console.error("Error al cargar datos del vehículo:", err);
        setError("Error al cargar los datos del vehículo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [carId]);

  // Manejador para cuando cambia el país seleccionado
  const handlePaisChange = async (value: string) => {
    const paisId = Number(value);
    setSelectedPais(paisId);
    
    // Resetear selecciones dependientes
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
    
    // Cargar todas las ciudades del país seleccionado
    try {
      const response = await axios.get(`${API_URL}/ciudades/${paisId}`);
      console.log(`Ciudades del país ${paisId}:`, response.data);
      if (response.data && Array.isArray(response.data)) {
        setCiudades(response.data);
      } else {
        setCiudades([]);
      }
    } catch (err) {
      console.error("Error al cargar ciudades:", err);
      setCiudades([]);
      alert("No se pudieron cargar las ciudades para este país");
    }
  };

  // Manejador para cuando cambia la ciudad seleccionada
  const handleCiudadChange = async (value: string) => {
    const ciudadId = Number(value);
    setSelectedCiudad(ciudadId);
    
    // Resetear provincia
    setSelectedProvincia(null);
    setNombreProvincia("");
    setProvincias([]);
    
    // Actualizar el nombre de la ciudad seleccionada
    const ciudadSeleccionada = ciudades.find(c => c.id === ciudadId);
    if (ciudadSeleccionada) {
      setNombreCiudad(ciudadSeleccionada.nombre);
    }
    
    // Cargar todas las provincias de la ciudad seleccionada
    try {
      const response = await axios.get(`${API_URL}/provincias/${ciudadId}`);
      console.log(`Provincias de la ciudad ${ciudadId}:`, response.data);
      if (response.data && Array.isArray(response.data)) {
        setProvincias(response.data);
      } else {
        setProvincias([]);
      }
    } catch (err) {
      console.error("Error al cargar provincias:", err);
      setProvincias([]);
      alert("No se pudieron cargar las provincias para esta ciudad");
    }
  };

  // Manejador para cuando cambia la provincia seleccionada
  const handleProvinciaChange = (value: string) => {
    const provinciaId = Number(value);
    setSelectedProvincia(provinciaId);
    
    // Actualizar el nombre de la provincia seleccionada
    const provinciaSeleccionada = provincias.find(p => p.id === provinciaId);
    if (provinciaSeleccionada) {
      setNombreProvincia(provinciaSeleccionada.nombre);
      console.log(`Provincia seleccionada: ID=${provinciaId}, Nombre=${provinciaSeleccionada.nombre}`);
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

  // Guardar los cambios - ADAPTADO AL MODELO DEL BACKEND
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
    
    // Verificar que tenemos un ID de provincia válido
    if (!selectedProvincia) {
      setError("No se ha seleccionado una provincia válida");
      setIsSaving(false);
      return;
    }
    
    // Obtener detalles de la provincia seleccionada para confirmar
    const provinciaSeleccionada = provincias.find(p => p.id === selectedProvincia);
    console.log("Provincia seleccionada para enviar:", provinciaSeleccionada);
    
    // Preparar los datos en el formato que el backend espera
    const datosParaEnviar = {
      id_provincia: selectedProvincia ? parseInt(selectedProvincia.toString()) : null, // ID de la provincia seleccionada en el combobox
      calle: calle,
      num_casa: numCasa
    };
    
    // También preparar un formato alternativo por si el backend espera otro nombre de campo
    const formatoAlternativo = {
      id_provincia: selectedProvincia ? parseInt(selectedProvincia.toString()) : null, // Versión alternativa del nombre del campo
      calle: calle,
      num_casa: numCasa
    };
    
    console.log("Datos a enviar (formato principal):", datosParaEnviar);
    console.log("Datos a enviar (formato alternativo):", formatoAlternativo);
    console.log(`Enviando a: ${API_URL}/carro/direccion/${carId}`);
    
    try {
      // Intentar con el formato principal primero
      const response = await axios.put(
        `${API_URL}/carro/direccion/${carId}`, 
        datosParaEnviar,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Respuesta del servidor:", response.data);
      setSuccessMessage("Dirección actualizada correctamente");
      
      // Redirigir después de un breve retraso
      setTimeout(() => router.push("/vehiculos"), 1500);
    } catch (err: any) {
      console.error("Error al actualizar la dirección:", err);
      
      // Extraer mensaje de error detallado si está disponible
      const errorMessage = 
        err.response?.data?.mensaje || 
        err.response?.data?.error || 
        err.message || 
        "Error al guardar los cambios";
      
      setError(`Error: ${errorMessage}`);
      
      // Verificar si el error indica qué formato espera
      if (err.response?.data?.error && typeof err.response.data.error === 'string') {
        const errorText = err.response.data.error.toLowerCase();
        
        // Si hay pistas sobre el formato esperado, intentamos con el formato alternativo
        if (errorText.includes('formato') || errorText.includes('invalid')) {
          console.log("Intentando con formato alternativo basado en el error...");
          
          try {
            const responseRetry = await axios.put(
              `${API_URL}/carro/direccion/${carId}`, 
              formatoAlternativo,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log("Respuesta con formato alternativo:", responseRetry.data);
            setSuccessMessage("Dirección actualizada correctamente");
            
            // Redirigir después de un breve retraso
            setTimeout(() => router.push("/vehiculos"), 1500);
          } catch (errRetry) {
            console.error("Error también con formato alternativo:", errRetry);
            // Mantener el error original
          }
        }
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
      
      {/* Información de depuración - Opcional, quitar en producción */}
      {selectedProvincia && (
        <div className="w-full max-w-5xl mt-4 text-gray-500 text-sm">
          <p>ID de provincia seleccionada: {selectedProvincia}</p>
        </div>
      )}
      
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

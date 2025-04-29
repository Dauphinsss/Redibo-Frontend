"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_URL = "https://redibo-backend-sprinteros1.onrender.com/api";

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
  
  // Estados para errores específicos por campo
  const [paisError, setPaisError] = useState<string | null>(null);
  const [ciudadError, setCiudadError] = useState<string | null>(null);
  const [provinciaError, setProvinciaError] = useState<string | null>(null);
  const [calleError, setCalleError] = useState<string | null>(null);
  const [numCasaError, setNumCasaError] = useState<string | null>(null);
  
  // Estado para controlar validación en tiempo real
  const [touched, setTouched] = useState({
    pais: false,
    ciudad: false,
    provincia: false,
    calle: false,
    numCasa: false
  });

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

        // Marcar todos los campos como tocados si hay datos previos
        if (datosCarro.paisId || datosCarro.ciudadId || datosCarro.provinciaId || 
            datosCarro.calle || datosCarro.num_casa) {
          setTouched({
            pais: !!datosCarro.paisId,
            ciudad: !!datosCarro.ciudadId,
            provincia: !!datosCarro.provinciaId,
            calle: !!datosCarro.calle,
            numCasa: !!datosCarro.num_casa
          });
        }

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

        // Validar los datos iniciales
        validateForm({
          pais: datosCarro.paisId,
          ciudad: datosCarro.ciudadId,
          provincia: datosCarro.provinciaId,
          calle: datosCarro.calle || "",
          numCasa: datosCarro.num_casa || ""
        });
        setIsLoading(false);

      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error al cargar datos del vehículo:", err.message);
        } else {
          console.error("Error al cargar datos del vehículo:", err);
        }
        setError("Error al cargar los datos del vehículo");
        setIsLoading(false);
      }
      
    };

    fetchInitialData();
  }, [carId]);

  // Función para validar el formulario completo
  const validateForm = (data: {
    pais: number | null,
    ciudad: number | null,
    provincia: number | null,
    calle: string,
    numCasa: string
  }) => {
    // Validar país
    if (!data.pais) {
      setPaisError("Debe seleccionar un país");
    } else {
      setPaisError(null);
    }
    
    // Validar ciudad
    if (!data.ciudad) {
      setCiudadError("Debe seleccionar una ciudad");
    } else {
      setCiudadError(null);
    }
    
    // Validar provincia
    if (!data.provincia) {
      setProvinciaError("Debe seleccionar una provincia");
    } else {
      setProvinciaError(null);
    }
    
    // Validar calle
    if (!data.calle.trim()) {
      setCalleError("La dirección de la calle es obligatoria");
    } else {
      setCalleError(null);
    }
    
    // Validar número de casa
    if (!data.numCasa.trim()) {
      setNumCasaError("El número de casa es obligatorio");
    } else if (!/^\d+$/.test(data.numCasa)) {
      setNumCasaError("Solo se permiten números en el número de casa");
    } else {
      setNumCasaError(null);
    }
  };

  // Comprobar si hay errores en el formulario
  const hasErrors = () => {
    return !!(paisError || ciudadError || provinciaError || calleError || numCasaError);
  };

  // Comprobar si algún campo está vacío
  const hasEmptyFields = () => {
    return !selectedPais || !selectedCiudad || !selectedProvincia || !calle.trim() || !numCasa.trim();
  };

  // Manejador para cuando cambia el país seleccionado
  const handlePaisChange = async (value: string) => {
    const paisId = Number(value);
    setSelectedPais(paisId);
    setTouched({...touched, pais: true});
    
    // Resetear selecciones dependientes y sus errores
    setSelectedCiudad(null);
    setNombreCiudad("");
    setSelectedProvincia(null);
    setNombreProvincia("");
    setCiudades([]);
    setProvincias([]);
    setCiudadError("Debe seleccionar una ciudad");
    setProvinciaError("Debe seleccionar una provincia");
    
    // Actualizar el nombre del país seleccionado
    const paisSeleccionado = paises.find(p => p.id === paisId);
    if (paisSeleccionado) {
      setNombrePais(paisSeleccionado.nombre);
      setPaisError(null);
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
      setCiudadError("No se pudieron cargar las ciudades para este país");
    }
  };

  // Manejador para cuando cambia la ciudad seleccionada
  const handleCiudadChange = async (value: string) => {
    const ciudadId = Number(value);
    setSelectedCiudad(ciudadId);
    setTouched({...touched, ciudad: true});
    
    // Resetear provincia y su error
    setSelectedProvincia(null);
    setNombreProvincia("");
    setProvincias([]);
    setProvinciaError("Debe seleccionar una provincia");
    
    // Actualizar el nombre de la ciudad seleccionada
    const ciudadSeleccionada = ciudades.find(c => c.id === ciudadId);
    if (ciudadSeleccionada) {
      setNombreCiudad(ciudadSeleccionada.nombre);
      setCiudadError(null);
    }
    
    // Cargar todas las provincias de la ciudad seleccionada
    try {
      const response = await axios.get(`${API_URL}/provincias/${ciudadId}`);
      console.log(`Provincias de la ciudad ${ciudadId}:`, response.data);
      if (response.data && Array.isArray(response.data)) {
        setProvincias(response.data);
      } else {
        setProvincias([]);
        setProvinciaError("No se encontraron provincias para esta ciudad");
      }
    } catch (err) {
      console.error("Error al cargar provincias:", err);
      setProvincias([]);
      setProvinciaError("No se pudieron cargar las provincias para esta ciudad");
    }
  };

  // Manejador para cuando cambia la provincia seleccionada
  const handleProvinciaChange = (value: string) => {
    const provinciaId = Number(value);
    setSelectedProvincia(provinciaId);
    setTouched({...touched, provincia: true});
    
    // Actualizar el nombre de la provincia seleccionada
    const provinciaSeleccionada = provincias.find(p => p.id === provinciaId);
    if (provinciaSeleccionada) {
      setNombreProvincia(provinciaSeleccionada.nombre);
      setProvinciaError(null);
      console.log(`Provincia seleccionada: ID=${provinciaId}, Nombre=${provinciaSeleccionada.nombre}`);
    }
  };

  // Manejador para validar el número de casa (solo números)
  const handleNumCasaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumCasa(value);
    setTouched({...touched, numCasa: true});
    
    if (!value.trim()) {
      setNumCasaError("El número de casa es obligatorio");
    } else if (!/^\d+$/.test(value)) {
      setNumCasaError("Solo se permiten números");
    } else {
      setNumCasaError(null);
    }
  };

  // Manejador para validar la calle
  const handleCalleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCalle(value);
    setTouched({...touched, calle: true});
    
    if (!value.trim()) {
      setCalleError("La dirección de calle es obligatoria");
    } else if (!/^[\w\s.]+$/.test(value)) {
      setCalleError("La calle solo puede contener letras, números, espacios y puntos");
    } else if (value.length > 200) {
      setCalleError("La calle no puede exceder los 200 caracteres");
    } else {
      setCalleError(null);
    }
  };

  // Manejador para cancelar
  const handleCancel = () => {
    if (window.confirm("¿Está seguro que desea cancelar? Los cambios no guardados se perderán.")) {
      router.push("/host"); // Redirigir a la lista de vehículos
    }
    // No hace nada si el usuario cancela el diálogo
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-lg ml-3">Cargando datos del vehículo...</p>
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
    // Marcar todos los campos como tocados para mostrar todos los errores
    setTouched({
      pais: true,
      ciudad: true,
      provincia: true,
      calle: true,
      numCasa: true
    });
    
    // Validar todos los campos
    validateForm({
      pais: selectedPais,
      ciudad: selectedCiudad,
      provincia: selectedProvincia,
      calle,
      numCasa
    });
    
    // Devolver true solo si no hay errores y ningún campo está vacío
    return !hasErrors() && !hasEmptyFields();
  };

  // Esta función se ejecuta al hacer clic en el botón de enviar dentro del formulario
  const handlePrepareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar antes de mostrar el diálogo
    if (!validarFormulario()) {
      // Si hay errores, no continuar con el envío
      return;
    }
    // El diálogo se abrirá automáticamente si la validación pasa
    // porque el botón tiene AlertDialogTrigger
  };

  // Función para manejar la confirmación del envío
  const handleConfirmSubmit = async () => {
    if (!carId) {
      alert("ID del vehículo no encontrado");
      return;
    }
    
    // Validar nuevamente antes de enviar al servidor
    if (!validarFormulario()) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    // Preparar los datos en el formato que el backend espera
    const datosParaEnviar = {
      id_provincia: selectedProvincia ? parseInt(selectedProvincia.toString()) : null,
      calle: calle,
      num_casa: numCasa
    };
    
    console.log("Datos a enviar:", datosParaEnviar);
    console.log(`Enviando a: ${API_URL}/carro/direccion/${carId}`);
    
    try {
      await axios.put(
        `${API_URL}/carro/direccion/${carId}`, 
        datosParaEnviar,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
 //     setSuccessMessage("Dirección actualizada correctamente");
      
      // Redirigir después de un breve retraso
      setTimeout(() => router.push("/host"), 1500);
    } catch (err: unknown) { // 👈 Aquí cambiamos any por unknown
      console.error("Error al actualizar la dirección:", err);
    
      let errorMessage = "Error al guardar los cambios";
    
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.mensaje || 
                       err.response?.data?.error || 
                       err.message || 
                       "Error de conexión con el servidor";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar si el botón de finalizar debe estar deshabilitado
  const isSubmitDisabled = hasErrors() || hasEmptyFields() || isSaving;

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

      <form onSubmit={handlePrepareSubmit}>
        {/* País */}
        <div className="w-full max-w-5xl flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">País <span className="text-red-500">*</span></label>
          <Select
            value={selectedPais?.toString()}
            onValueChange={handlePaisChange}
          >
            <SelectTrigger className={`w-[600px] mt-2 ${touched.pais && paisError ? 'border-red-500' : ''}`}>
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
          {touched.pais && paisError && (
            <p className="text-red-500 text-sm mt-1">{paisError}</p>
          )}
        </div>

        {/* Ciudad */}
        <div className="w-full max-w-5xl flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">Ciudad <span className="text-red-500">*</span></label>
          <Select
            value={selectedCiudad?.toString()}
            onValueChange={handleCiudadChange}
            disabled={!selectedPais}
          >
            <SelectTrigger className={`w-[600px] mt-2 ${touched.ciudad && ciudadError ? 'border-red-500' : ''}`}>
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
          {touched.ciudad && ciudadError && (
            <p className="text-red-500 text-sm mt-1">{ciudadError}</p>
          )}
          {!selectedPais && !touched.ciudad && (
            <p className="text-amber-600 text-sm mt-1">Seleccione primero un país</p>
          )}
        </div>

        {/* Provincia */}
        <div className="w-full max-w-5xl flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">Provincia <span className="text-red-500">*</span></label>
          <Select
            value={selectedProvincia?.toString()}
            onValueChange={handleProvinciaChange}
            disabled={!selectedCiudad}
          >
            <SelectTrigger className={`w-[600px] mt-2 ${touched.provincia && provinciaError ? 'border-red-500' : ''}`}>
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
          {touched.provincia && provinciaError && (
            <p className="text-red-500 text-sm mt-1">{provinciaError}</p>
          )}
          {!selectedCiudad && !touched.provincia && (
            <p className="text-amber-600 text-sm mt-1">Seleccione primero una ciudad</p>
          )}
        </div>

        {/* Dirección calle */}
        <div className="w-full max-w-5xl flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Dirección de la calle <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={calle}
            onChange={handleCalleChange}
            disabled={!selectedProvincia}
            className={`w-[600px] mt-2 p-2 border ${touched.calle && calleError ? 'border-red-500' : 'border-gray-300'} rounded`}
            placeholder="Ingrese la dirección de la calle"
          />
          {touched.calle && calleError && (
            <p className="text-red-500 text-sm mt-1">{calleError}</p>
          )}
          {!selectedProvincia && !touched.calle && (
            <p className="text-amber-600 text-sm mt-1">Seleccione primero una provincia</p>
          )}
        </div>

        {/* Número de casa - Con validación para solo números */}
        <div className="w-full max-w-5xl flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Número de casa <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={numCasa}
            onChange={handleNumCasaChange}
            disabled={!selectedProvincia}
            className={`w-[600px] mt-2 p-2 border ${touched.numCasa && numCasaError ? 'border-red-500' : 'border-gray-300'} rounded`}
            placeholder="Ingrese solo números"
          />
          {touched.numCasa && numCasaError && (
            <p className="text-red-500 text-sm mt-1">{numCasaError}</p>
          )}
          {!selectedProvincia && !touched.numCasa && (
            <p className="text-amber-600 text-sm mt-1">Seleccione primero una provincia</p>
          )}
        </div>
        
        {/* Botones */}
        <div className="flex justify-between mt-10 w-full max-w-5xl">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#D3D3D3" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E0E0E0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D3D3D3")}
            disabled={isLoading || isSaving}
          >
            CANCELAR
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="submit"
                variant="default"
                className={`h-12 text-lg font-semibold text-white px-6 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitDisabled}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    GUARDANDO...
                  </>
                ) : (
                  "FINALIZAR EDICIÓN Y GUARDAR"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Guardar cambios
                </AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desea guardar los cambios en la dirección?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSubmit}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
};

export default EditarDireccionPage;
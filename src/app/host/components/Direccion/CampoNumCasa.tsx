"use client";
import { Input } from "@/components/ui/input";

interface CampoNumCasaProps {
  numCasa: string;
  onNumCasaChange: (value: string) => void;
  numCasaError: string;
  setNumCasaError: (value: string) => void;
}

export default function CampoNumCasa({ numCasa, onNumCasaChange, numCasaError, setNumCasaError }: CampoNumCasaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyNumbersRegex = /^\d*$/;
    onNumCasaChange(value);
    if (onlyNumbersRegex.test(value) || value === '') {
      // Si es solo números o está vacío, actualiza el estado local (que pasará el valor al padre)
      onNumCasaChange(value);

      // Luego, aplica las validaciones de negocio
      if (!value.trim()) {
          setNumCasaError("El número de casa es obligatorio");
      } else if (value.length > 20) { // Mantienes la validación de longitud si es necesario
          setNumCasaError("El número no puede exceder los 20 caracteres");
      } else {
          // Si pasa todas las validaciones, limpia el error
          setNumCasaError("");
      }
     } else {
      // Si el valor contiene caracteres no numéricos, NO actualizamos el estado
      // Mostramos un error para informar al usuario
      setNumCasaError("Solo se permiten números");
      // No llamas a onNumCasaChange(value) aquí para evitar que el caracter no numérico aparezca en el input
    }
  };


  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Número de casa:<span className="text-red-600"> *</span></label>
      <Input 
        type="text" 
        value={numCasa} 
        onChange={handleChange}
        placeholder="Ej: 1234 o 0000"
        className="max-w-md" 
      />
      {numCasaError && <p className="text-sm text-red-600 mt-1">{numCasaError}</p>}
    </div>
  );
}
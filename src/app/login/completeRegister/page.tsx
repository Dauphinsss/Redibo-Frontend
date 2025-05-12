"use client";

//import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/utils/bakend";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Ciudad } from "@/utils/types";
import { isUnderage } from "../../../lib/utils";
import Link from "next/link";

type UserType = "HOST" | "RENTER";

export default function CompleteRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [ciudad, setCiudad] = useState<number>(0);
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<UserType | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  // Estados para errores
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ciudadTouched, setCiudadTouched] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Obtener el token desde la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error("Token no encontrado en la URL");
        }

        // 2. Realizar la petición al backend con el token
        const userResponse = await axios.get(`${API_URL}/api/auth/validateTokenCompleteRegister`, {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });

        console.log(userResponse, "\n", userResponse.data);

        // 3. Establecer datos del usuario
        if (userResponse.data.success) {
          setNombre(userResponse.data.nombre);
          setCorreo(userResponse.data.email);
        } else {
          throw new Error("Datos de usuario no disponibles");
        }

        // 4. Cargar ciudades
        const ciudadesResponse = await axios.get(`${API_URL}/api/ciudades`);
        setCiudades(ciudadesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Sesión inválida o expirada");
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);
  

  // Validaciones en tiempo real
  useEffect(() => {
    const nuevosErrores: { [key: string]: string } = {};
    if (telefono && telefono.length !== 8) nuevosErrores.telefono = "El teléfono debe tener exactamente 8 números";
      else if (telefono && !/^[467]/.test(telefono))
        nuevosErrores.telefono = "El teléfono debe comenzar con 4, 6 o 7";
    if (fechaNacimiento && isUnderage(fechaNacimiento)) nuevosErrores.fechaNacimiento = "Debes ser mayor de 18 años.";
    if (ciudadTouched && ciudad === 0) nuevosErrores.ciudad = "Debes seleccionar una ciudad";
    setErrores((prev) => ({ ...prev, ...nuevosErrores }));
  }, [telefono, fechaNacimiento, ciudad, ciudadTouched]);

  // Handlers para limpiar errores en tiempo real
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setTelefono(value);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (value.length === 8 && /^[467]/.test(value)) delete newErr.telefono;
        else newErr.telefono = value
        ? value.length !== 8
        ? "El teléfono debe tener exactamente 8 números"
          : "El teléfono debe comenzar con 4, 6 o 7"
          : "El teléfono es obligatorio.";
    return newErr;
  });
  };
  const handleFechaNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFechaNacimiento(value);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (!value) newErr.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
      else if (isUnderage(value)) newErr.fechaNacimiento = "Debes ser mayor de 18 años.";
      else delete newErr.fechaNacimiento;
      return newErr;
    });
  };
  const handleGeneroChange = (v: string) => {
    setGenero(v);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (v) delete newErr.genero;
      else newErr.genero = "El género es obligatorio.";
      return newErr;
    });
  };
  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setCiudad(value);
    setCiudadTouched(true);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (value && value !== 0) delete newErr.ciudad;
      else if (ciudadTouched) newErr.ciudad = "Debes seleccionar una ciudad";
      return newErr;
    });
  };
  const handleRolChange = (v: string) => {
    setRol(v as UserType);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (v) delete newErr.rol;
      else newErr.rol = "El rol es obligatorio.";
      return newErr;
    });
  };
  const handleTermsChange = (v: boolean) => {
    setAcceptTerms(v);
    setErrores((prev) => {
      const newErr = { ...prev };
      if (v) delete newErr.terms;
      else newErr.terms = "Debes aceptar los términos y condiciones.";
      return newErr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: { [key: string]: string } = {};
    if (!telefono) nuevosErrores.telefono = "El teléfono es obligatorio.";
    else if (telefono.length !== 8) nuevosErrores.telefono = "El teléfono debe tener exactamente 8 números";
    if (!fechaNacimiento) nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    else if (isUnderage(fechaNacimiento)) nuevosErrores.fechaNacimiento = "Debes ser mayor de 18 años.";
    if (!genero) nuevosErrores.genero = "El género es obligatorio.";
    if (!ciudad || ciudad === 0) nuevosErrores.ciudad = "Debes seleccionar una ciudad";
    if (!rol) nuevosErrores.rol = "El rol es obligatorio.";
    if (!acceptTerms) nuevosErrores.terms = "Debes aceptar los términos y condiciones.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setIsSubmitting(true);
  
    // Datos que espera el backend (nombres exactos con snake_case)
    const userData = {
      nombre: nombre || "",
      correo: correo || "",
      fechaNacimiento,
      genero,
      ciudad,
      telefono,
      rol
    };
  
    try {
      console.log("🧪 Enviando al backend:", userData);
      console.log("🧪 Clave fecha_nacimiento:", userData.fechaNacimiento,);
  
      // Enviar al backend (registro real)
      const response = await axios.post(`${API_URL}/api/auth/complete-profile`, userData, {withCredentials:true});
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      toast.success("Registro exitoso. Bienvenido/a a REDIBO.");
      // Guardar en localStorage
      localStorage.setItem("nombre", response.data.usuario.nombre);
      // localStorage.setItem("correo", response.data.usuario.correo);
      // localStorage.setItem("telefono", response.data.usuario.telefono);
      // localStorage.setItem("fecha_nacimiento", response.data.usuario.fecha_nacimiento);
      // localStorage.setItem("genero", response.data.usuario.genero);
      // localStorage.setItem("ciudad", response.data.usuario.ciudad);
      localStorage.setItem("foto", response.data.usuario.foto || "default.jpg");
      localStorage.setItem("roles", response.data.usuario.roles || "");
      localStorage.setItem("auth_token", response.data.token);
      // Cerrar el popup y notificar a la ventana principal
      if (window.opener) {
        window.opener.postMessage({
          registrado: true,
          nombre: userData.nombre,
        }, "*");
      } else {
        router.push("/");
      }
    } catch (error: unknown ) {
      console.error("❌ Error al completar registro con Google:", error);
      const mensajeError = "Error al completar el registro. Por favor, intenta nuevamente.";
      toast.error(mensajeError);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex justify-center min-h-screen items-center p-4">
      {isLoading ? (
        // Spinner de carga
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-2 border-black"></div>
      ) : (
    //<div className="flex justify-center min-h-screen items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Completa tu registro</CardTitle>
          <CardDescription>
          {nombre}, necesitamos un poco más de información para terminar.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input value={nombre || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Correo</Label>
              <Input value={correo || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label>Teléfono *</Label>
              <Input
                value={telefono}
                onChange={handleTelefonoChange}
                maxLength={8}
                placeholder="Ingresa tu teléfono"
              />
              {errores.telefono && <p className="text-sm text-red-500 mt-1">{errores.telefono}</p>}
            </div>

            <div className="space-y-2">
              <Label>Fecha de nacimiento *</Label>
              <Input
                type="date"
                value={fechaNacimiento}
                onChange={handleFechaNacimientoChange}
                max={today}
              />
              {errores.fechaNacimiento && <p className="text-sm text-red-500 mt-1">{errores.fechaNacimiento}</p>}
            </div>

            <div className="space-y-2">
              <Label>Género *</Label>
              <RadioGroup value={genero} onValueChange={handleGeneroChange} className="flex gap-4">
            <div className="flex items-center gap-4">
            <RadioGroupItem value="MASCULINO" id="masc" />
              <Label htmlFor="masc">Masculino</Label>
            </div>
            <div className="flex items-center gap-4">
            <RadioGroupItem value="FEMENINO" id="fem" />
              <Label htmlFor="fem">Femenino</Label>
            </div>
            <div className="flex items-center gap-4">
            <RadioGroupItem value="OTRO" id="otro" />
              <Label htmlFor="otro">Otro</Label>
            </div>
          </RadioGroup>
              {errores.genero && <p className="text-sm text-red-500 mt-1">{errores.genero}</p>}
            </div>

            <div className="space-y-2">
              <Label>Ciudad *</Label>
              <select
                value={ciudad}
                onChange={handleCiudadChange}
                className="w-full h-10 px-3 border rounded-md"
              >
                <option value={0} disabled>Selecciona una ciudad</option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {ciudadTouched && errores.ciudad && <p className="text-sm text-red-500 mt-1">{errores.ciudad}</p>}
            </div>

            <div className="space-y-2">
              <Label>Rol *</Label>
              <RadioGroup value={rol || ""} onValueChange={handleRolChange} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="HOST" id="host" />
                  <Label htmlFor="host">Propietario</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="RENTER" id="renter" />
                  <Label htmlFor="renter">Arrendatario</Label>
                </div>
              </RadioGroup>
              {errores.rol && <p className="text-sm text-red-500 mt-1">{errores.rol}</p>}
            </div>

            <div>
                <Link href="/terminos-y-condiciones ">
                  <Button
                    variant="link"
                    className="font-normal -ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("/terminos-y-condiciones", "_blank");
                    }}
                  >
                    Leer términos y condiciones{" "}
                    <ChevronRight className="-ml-1" />
                  </Button>
                </Link>
              </div>

            <div className="flex items-center gap-4">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={handleTermsChange} />
              <Label htmlFor="terms" className="text-sm">
                He leído y acepto los terminos y condiciones
              </Label>
            </div>
            {/*{errores.terms && <p className="text-sm text-red-500 mt-1">{errores.terms}</p>} */}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              ref={btnRef}
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={!acceptTerms || isSubmitting}
              style={{ position: "relative" }}
            >
              {isSubmitting ? (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#fff"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="#fff"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </span>
              ) : (
                "Finalizar Registro"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    )}
  </div>
);
}

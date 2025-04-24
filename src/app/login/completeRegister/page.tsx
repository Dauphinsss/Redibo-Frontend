"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import InputErrorIcon from "@/components/ui/inputErrorIcon";
import { Ciudad } from "@/utils/types";
import { isUnderage } from "../../../lib/utils";

type UserType = "HOST" | "RENTER" | "DRIVER";

export default function CompleteRegisterForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [ciudad, setCiudad] = useState<number>(0);
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<UserType | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/ciudades`);
        if (Array.isArray(data) && data.length > 0) {
          setCiudades(data);
        } else {
          toast.error("No se encontraron ciudades.");
        }
      } catch (error) {
        toast.error("Error al cargar ciudades desde el servidor.");
        console.error("Error al cargar ciudades:", error);
      }
    };
  
    fetchCiudades();
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validar campos obligatorios
    if (!fechaNacimiento || !genero || !ciudad || !telefono || !rol || !acceptTerms) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    // Datos que espera el backend (nombres exactos con snake_case)
    const userData = {
      nombre: session?.user?.name || "",
      correo: session?.user?.email || "",
      fechaNacimiento, // ahora en snake_case
      genero,
      ciudad,
      telefono,
      rol,
      foto: session?.user?.image || ""
    };
  
    try {
      console.log("Enviando al backend:", userData);
      console.log("Clave fecha_nacimiento:", userData.fechaNacimiento,); //Este ya no fallará
  
      // Enviar al backend (registro real)
    
      toast.success("Registro exitoso. Bienvenido/a a REDIBO.");
  
      // Cerrar el popup y notificar a la ventana principal
      if (window.opener) {
        window.opener.postMessage({
          registrado: true,
          nombre: userData.nombre,
          foto: userData.foto
        }, "*");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(" Error al completar registro con Google:", error);
      toast.error("Ocurrió un error al registrar tu perfil.");
    }
  };
  

  return (
    <div className="flex justify-center min-h-screen items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Completa tu registro</CardTitle>
          <CardDescription>
            {session?.user?.name}, necesitamos un poco más de información para terminar.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <Input value={session?.user?.name || ""} disabled />
            </div>
            <div>
              <Label>Correo</Label>
              <Input value={session?.user?.email || ""} disabled />
            </div>

            <div>
              <Label>Teléfono *</Label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                maxLength={8}
                placeholder="Ingresa tu teléfono"
              />
              {telefono && telefono.length !== 8 && (
                <InputErrorIcon message="Debe tener 8 dígitos." />
              )}
            </div>

            <div>
              <Label>Fecha de nacimiento *</Label>
              <Input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                max={today}
              />
              {fechaNacimiento && isUnderage(fechaNacimiento) && (
                <InputErrorIcon message="Debes ser mayor de 18 años." />
              )}
            </div>

            <div>
              <Label>Género *</Label>
              <RadioGroup value={genero} onValueChange={setGenero} className="flex gap-4">
  <div className="flex items-center gap-2">
  <RadioGroupItem value="MASCULINO" id="masc" />
    <Label htmlFor="masc">Masculino</Label>
  </div>
  <div className="flex items-center gap-2">
  <RadioGroupItem value="FEMENINO" id="fem" />
    <Label htmlFor="fem">Femenino</Label>
  </div>
  <div className="flex items-center gap-2">
  <RadioGroupItem value="OTRO" id="otro" />
    <Label htmlFor="otro">Otro</Label>
  </div>
</RadioGroup>

            </div>

            <div>
              <Label>Ciudad *</Label>
              <select
                value={ciudad}
                onChange={(e) => setCiudad(Number(e.target.value))}
                className="w-full h-10 px-3 border rounded-md"
              >
                <option value={0}>Selecciona una ciudad</option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Rol *</Label>
              <RadioGroup value={rol || ""} onValueChange={(v) => setRol(v as UserType)} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="HOST" id="host" />
                  <Label htmlFor="host">Propietario</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="RENTER" id="renter" />
                  <Label htmlFor="renter">Arrendatario</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="DRIVER" id="driver" />
                  <Label htmlFor="driver">Conductor</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v as boolean)} />
              <Label htmlFor="terms" className="text-sm">Acepto los términos y condiciones</Label>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={!acceptTerms}>
              Finalizar Registro
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

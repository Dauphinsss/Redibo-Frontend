"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Ciudad } from "@/utils/types";
import { API_URL } from "@/utils/bakend";

interface Props {
  userId: number;
  nombre: string;
  correo: string;
  onSuccess: (token: string) => void;
}

export default function CompleteGoogleProfileForm({
  userId,
  nombre,
  correo,
  onSuccess,
}: Props) {
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [ciudad, setCiudad] = useState<number>(0);
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/ciudades`).then((res) => {
      setCiudades(res.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaNacimiento || !genero || !ciudad || !telefono || !rol) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/completeUserProfile`, {
        id: userId,
        fechaNacimiento,
        genero,
        ciudad,
        telefono,
        rol,
      });

      if (res.data?.token) {
        onSuccess(res.data.token);
      } else {
        toast.error("No se recibió token");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al completar perfil");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <Label>Nombre</Label>
        <Input value={nombre} disabled />
      </div>
      <div>
        <Label>Correo</Label>
        <Input value={correo} disabled />
      </div>
      <div>
        <Label>Fecha de nacimiento</Label>
        <Input
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div>
        <Label>Género</Label>
        <RadioGroup value={genero} onValueChange={setGenero}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MASCULINO" id="masculino" />
            <Label htmlFor="masculino">Masculino</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMENINO" id="femenino" />
            <Label htmlFor="femenino">Femenino</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Ciudad</Label>
        <select
          value={ciudad}
          onChange={(e) => setCiudad(Number(e.target.value))}
          required
          className="w-full border rounded-md p-2"
        >
          <option value={0}>Seleccione ciudad</option>
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Teléfono</Label>
        <Input
          value={telefono}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 8) {
              setTelefono(value);
            }
          }}
          required
        />
      </div>
      <div>
        <Label>Rol</Label>
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">Selecciona un rol</option>
          <option value="HOST">Propietario</option>
          <option value="RENTER">Arrendatario</option>
          <option value="DRIVER">Conductor</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        Finalizar Registro
      </Button>
    </form>
  );
}

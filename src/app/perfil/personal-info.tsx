"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: string;
  ciudad: {
    id: number;
    nombre: string;
  };
  roles: string[];
}

export function PersonalInfo() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
          console.error("No se encontró el token de autenticación");
          return;
        }

        const response = await axios.get<UserProfile>(`${API_URL}/api/perfil`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Formatear la fecha antes de guardarla en el estado
        const formattedData = {
          ...response.data,
          fecha_nacimiento: response.data.fecha_nacimiento
            ? new Date(response.data.fecha_nacimiento)
                .toISOString()
                .split("T")[0]
            : "",
        };

        setUserData(formattedData);
        console.log("Datos del usuario:", formattedData); // Para debug
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Cargando información personal...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="nombre" className="text-base">
              Nombre Completo
            </Label>
            <a className="text-base">{userData?.nombre}</a>
          </div>

          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="correo" className="text-base">
              Correo Electrónico
            </Label>
            <a className="text-base">{userData?.correo}</a>
          </div>

          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="telefono">Número de Teléfono</Label>
            <a className="text-base">{userData?.telefono}</a>
          </div>

          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
            <a className="text-base">{userData?.fecha_nacimiento}</a>
          </div>

          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="genero">Género</Label>
            <a className="text-base">{userData?.genero}</a>
          </div>

          <div className="grid col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <a className="text-base">{userData?.ciudad.nombre}</a>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full md:w-auto bg-gray-200 text-gray-500 cursor-not-allowed"
            disabled={true}
          >
            {isEditing ? "Cancelar" : "Editar Información"}
          </Button>
          {isEditing && (
            <Button
              className="ml-4 w-full md:w-auto"
              onClick={() => {
                // Aquí iría la lógica para guardar los cambios
                setIsEditing(false);
              }}
            >
              Guardar Cambios
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

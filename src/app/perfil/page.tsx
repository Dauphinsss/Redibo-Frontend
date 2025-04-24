"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { JWT } from "next-auth/jwt";

interface ExtendedSession extends Session {
  accessToken?: string;
}
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/utils/bakend";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface UserProfile {
  nombre: string;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  ciudad: {
    nombre: string;
  };
  telefono: string;
  foto: string;
}

interface ErrorResponse {
  error: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.accessToken) {
        try {
          const response = await axios.get<UserProfile>(`${API_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
          
          setProfile(response.data);
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          console.error("Error fetching profile:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
            config: {
              url: axiosError.config?.url,
              headers: axiosError.config?.headers
            }
          });
          if (axiosError.response?.status === 401) {
            toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
          } else {
            toast.error(axiosError.response?.data?.error || "Error al cargar el perfil");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <p className="text-center">Cargando perfil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <p className="text-center">Por favor inicia sesión para ver tu perfil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userImage = session?.user?.image || null;
  const userName = session?.user?.name || 'Usuario';
  const userInitial = userName.charAt(0);

  return (
    <div className="flex justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              {userImage ? (
                <img src={userImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
              )}
            </Avatar>
          </div>
          <CardTitle className="text-2xl mb-2">{profile?.nombre || userName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Correo</p>
                  <p className="font-medium">{profile.correo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{profile.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                  <p className="font-medium">{new Date(profile.fecha_nacimiento).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="font-medium">{profile.genero}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ciudad</p>
                  <p className="font-medium">{profile.ciudad.nombre}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p>No se pudo cargar la información del perfil</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

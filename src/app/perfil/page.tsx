"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/footer";
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
  ciudad: string;
  telefono: string;
  foto: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDataFromURL = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        const token = urlParams.get('token');

        if (encodedData && token) {
          const decodedData = JSON.parse(atob(encodedData));
          
          // Guardar en localStorage
          Object.entries(decodedData).forEach(([key, value]) => {
            localStorage.setItem(key, String(value));
          });
          localStorage.setItem("auth_token", token);

          // Limpiar parámetros de la URL
          window.history.replaceState({}, document.title, "/perfil");
        }
      } catch (error) {
        console.error("Error procesando datos de URL:", error);
        toast.error("Error al procesar datos de autenticación");
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const authToken = localStorage.getItem("auth_token");
        
        if (!authToken) {
          toast.error("No autenticado");
          router.push("/login");
          return;
        }

        const profileData: UserProfile = {
          nombre: localStorage.getItem("nombre") || "",
          correo: localStorage.getItem("correo") || "",
          fecha_nacimiento: localStorage.getItem("fecha_nacimiento") || "",
          genero: localStorage.getItem("genero") || "",
          ciudad: localStorage.getItem("ciudad") || "",
          telefono: localStorage.getItem("telefono") || "",
          foto: localStorage.getItem("foto") || "default.jpg"
        };

        if (profileData.nombre) {
          setUserData(profileData);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    // Primero procesar datos de URL si existen
    handleDataFromURL();
    
    // Luego cargar datos de localStorage
    loadFromLocalStorage();
  }, [router]);

  if (loading) {
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

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <p className="text-center">Por favor inicia sesión primero</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userImage = userData.foto;
  const userName = userData.nombre;
  const userInitial = userName.charAt(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex justify-center flex-1 min-h-[calc(100vh-64px)] p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                {userImage ? (
                  <img 
                    src={userImage} 
                    alt="Profile" 
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
                )}
              </Avatar>
            </div>
            <CardTitle className="text-2xl mb-2">{userName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Correo</p>
                <p className="font-medium">{userData.correo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{userData.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {new Date(userData.fecha_nacimiento).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Género</p>
                <p className="font-medium">{userData.genero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ciudad</p>
                <p className="font-medium">{userData.ciudad}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
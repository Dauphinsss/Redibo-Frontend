"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import CompleteGoogleProfileForm from "@/components/forms/CompleteGoogleProfileForm";


export default function PopupHandler() {
  const { data: session, status } = useSession();
  const [estado, setEstado] = useState<"cargando" | "nuevo" | "registrado">("cargando");
  interface Perfil {
    id: string;
    perfil_completo: boolean;
    // Agrega más propiedades si es necesario
  }

  const [perfil, setPerfil] = useState<Perfil | null>(null); // Guarda los datos devueltos del backend

  // Paso 1: iniciar sesión con Google apenas se monta
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: "/auth/popup-handler?popup=true" });
    }
  }, [status]);

  // Paso 2: consultar al backend si el perfil ya está completo
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`http://localhost:4000/api/auth/checkProfileStatus/${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setPerfil(data); // Guardar datos del backend
          if (data.perfil_completo) {
            window.opener?.location.replace("/home");
            window.close();
          } else {
            setEstado("nuevo");
          }
        })
        .catch((err) => {
          console.error("Error consultando perfil:", err);
          setEstado("nuevo");
        });
    }
  }, [session, status]);

  // Cargando mientras se espera sesión o respuesta del backend
  if (estado === "cargando") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        <p className="mt-4 text-gray-600">Iniciando sesión con Google...</p>
      </div>
    );
  }

  // Mostrar formulario si el usuario es nuevo
  if (estado === "nuevo" && perfil && session?.user) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Completa tu perfil para continuar</h2>
        <CompleteGoogleProfileForm
          userId={parseInt(perfil.id, 10)}
          nombre={session.user.name || ""}
          correo={session.user.email || ""}
          onSuccess={(token) => {
            localStorage.setItem("token", token); // si deseas guardar el token
            window.opener?.location.replace("/home");
            window.close();
          }}
        />
      </div>
    );
  }

  return null;
}

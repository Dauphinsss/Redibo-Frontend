// ✅ 1. Login Redirect Page
// Archivo: src/app/login/redirect/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

export default function LoginRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const verificarPerfil = async () => {
      if (status === "authenticated" && session?.user?.email) {
        const email = encodeURIComponent(session.user.email);
        const url = `${API_URL}/api/auth/check-profile/email/${email}`;

        try {
          const { data } = await axios.get(url);
          console.log("✅ Respuesta del backend:", data);

          if (data.perfilCompleto) {
            // Guardar en localStorage
            localStorage.setItem("nombre", session.user.name || "");
            localStorage.setItem("foto", session.user.image || "");

            // Redirigir a pantalla principal ("/")
            router.push("/");
          } else {
            router.push("/login/completeRegister");
          }
        } catch (error) {
          console.error("❌ Error al verificar perfil:", error);
          router.push("/login/completeRegister");
        }
      }
    };

    verificarPerfil();
  }, [session, status, router]);

  return <p className="text-center p-10">Verificando perfil...</p>;
}

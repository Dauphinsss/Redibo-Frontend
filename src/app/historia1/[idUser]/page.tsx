"use client";

import { use } from "react";
import Header from "@/components/ui/Header";
import RenterProfilePage from "@/components/ui/historia1/RenterProfilePage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Historia1Page({ params }: { params: Promise<{ idUser: string }> }) {
  const router = useRouter();
  const { idUser } = use(params);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (!access || access !== "valid") {
      router.push("/historia4");
    }
  }, [router]);

  return (
    <div>
      <Header />
      <div className="p-8">
        {idUser ? (
          <RenterProfilePage idUser={idUser} />
        ) : (
          <div className="text-center py-8">
            Cargando información del usuario...
          </div>
        )}
      </div>
    </div>
  );
}
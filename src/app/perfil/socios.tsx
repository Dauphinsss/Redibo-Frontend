"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SociosSection() {
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const rolesStr = localStorage.getItem("roles") || "";
    let parsed: string[] = [];
    if (rolesStr.includes("[")) {
      try {
        parsed = JSON.parse(rolesStr);
      } catch {
        parsed = rolesStr.split(",").map((r) => r.trim());
      }
    } else {
      parsed = rolesStr.split(",").map((r) => r.trim());
    }
    setRoles(parsed);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6 items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-semibold mb-2">Socios</h2>
      <p className="text-gray-600 mb-4 text-center">Gestiona tus conductores asociados y revisa su información.</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {roles.includes("RENTER") && (
          <Button className="w-full" onClick={() => router.push("/perfil/socios/conductores")}> <Users className="mr-2 h-5 w-5" /> Ver mis conductores </Button>
        )}
        {roles.includes("DRIVER") && (
          <Button className="w-full" onClick={() => router.push("/perfil/socios/arrendatarios")}> <Users className="mr-2 h-5 w-5" /> Ver mis arrendatarios </Button>
        )}
        {!roles.includes("RENTER") && !roles.includes("DRIVER") && (
          <div className="text-gray-500 text-center">No tienes roles de Renter ni Driver asignados.</div>
        )}
      </div>
    </div>
  );
}

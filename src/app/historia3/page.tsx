"use client";
import Header from "@/components/ui/Header";
import { Tasklist } from "@/components/ui/historia3/Tasklist";
import { useEffect, useState } from "react";
export default function Historia3Page() {
    const [hostId, setHostId] = useState<number | null>(null);
    useEffect(() => {
      const id_usuarioHost=4
    setHostId(id_usuarioHost); 
    }, []);
    return (
    <div>
      <Header />
      <div className="p-8">
      {hostId ?(
        <Tasklist hostId={hostId} />
      ):(
        <div className="text-center py-8">Cargando información del host...</div>
      )
      }
      </div>
    </div>
  );
}
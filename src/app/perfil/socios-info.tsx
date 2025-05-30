"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Socio {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  foto?: string;
}

export function SociosSection() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await axios.get(`${API_URL}/api/socios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSocios(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener socios:", err);
        setError("Error al cargar los socios");
        setLoading(false);
      }
    };

    fetchSocios();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mis Socios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socios.map((socio) => (
          <Card key={socio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={socio.foto} alt={socio.nombre} />
                <AvatarFallback>{socio.nombre.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{socio.nombre}</CardTitle>
                <Badge variant={socio.rol === "RENTER" ? "default" : "secondary"}>
                  {socio.rol === "RENTER" ? "Arrendatario" : "Conductor"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{socio.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
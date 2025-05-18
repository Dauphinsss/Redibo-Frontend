"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

export function AdminHeader() {
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUserData({
          nombre: res.data.nombre || "Administrador",
          email: res.data.email || "",
        });

      } catch (err) {
        console.error("Error al obtener datos del usuario", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 lg:p-8 bg-white border-b border-gray-100">
      <div className="flex items-center mb-4 sm:mb-0">
        <Avatar className="h-12 w-12 border border-gray-200">
          <AvatarImage src="/placeholder-avatar.png" alt="Avatar" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {userData.nombre}
            </h2>
            <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
              ADMIN
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>
    </div>
  );
}
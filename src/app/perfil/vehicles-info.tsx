"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { API_URL } from "@/utils/bakend"
import { SteeringWheel } from "./steering-wheel-icon"

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

export function VehiclesInfo() {
  const [roles, setRoles] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const res = await axios.get<UserProfile>(`${API_URL}/api/perfil`, {
          headers: { 
            Authorization: `Bearer ${token}` }
        })
        setRoles(res.data.roles || [])
      } catch (error) {
        console.error("Error al obtener roles", error)
      }
    }

    fetchRoles()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sección de Vehículos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
        {roles.includes("HOST") && (
          <div
          className="ml-50 w-64 h-32 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ml-4"

            onClick={() => router.push("/vehicles/misVehicles")}
          >
            <SteeringWheel className="mx-auto mb-3 h-10 w-10" />
            <p className="text-lg font-semibold">Mis Vehículos</p>
          </div>
        )}

        {roles.includes("RENTER") && (
          <div
          className="w-64 h-32 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-4 text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"

            onClick={() => router.push("/vehicles/vehiclesRentados")}
          >
            <SteeringWheel className="mx-auto mb-3 h-10 w-10" />
            <p className="text-lg font-semibold">Vehículos Rentados</p>
          </div>
        )}
      </div>
    </div>
  )
}

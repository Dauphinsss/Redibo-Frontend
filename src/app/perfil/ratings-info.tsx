"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/utils/bakend"
import { useRouter } from "next/navigation"

interface UserProfile {
  roles: string[];
}

export function RatingsInfo() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem("auth_token")
        if (!authToken) {
          console.error("No se encontró el token de autenticación")
          return
        }

        const response = await axios.get<UserProfile>(`${API_URL}/api/perfil`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        setUserData(response.data)
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const roles = userData?.roles || []

  const showCalificarPropietario = roles.includes("RENTER")
  const showCalificarArrendatario = roles.includes("HOST") || roles.includes("DRIVER")
  const showCalificarVehiculo = roles.includes("RENTER") || roles.includes("DRIVER")

  if (loading) {
    return <div>Cargando calificaciones...</div>
  }
  return (
    <div className="p-4">
  
      <div className="flex flex-col items-center space-y-6">
        {/* Fila superior: Propietario y Arrendatario */}
        <div className="flex justify-center gap-10">
          {showCalificarPropietario && (
            <div
              className="w-64 h-40 bg-black text-white hover:bg-gray-900 rounded-xl p-6 text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
              onClick={() => router.push("/calificaciones/calificacionesAlHost")}
            >
              <Star className="mx-auto mb-3 h-10 w-10" />
              <p className="text-lg font-semibold">Calificar Propietario</p>
            </div>
          )}
  
          {showCalificarArrendatario && (
            <div
              className="w-64 h-40 bg-black text-white hover:bg-gray-900 text-white rounded-xl p-6 text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
              onClick={() => router.push("/calificaciones/calificacionesAlRenter")}
            >
              <Star className="mx-auto mb-3 h-10 w-10" />
              <p className="text-lg font-semibold">Calificar Arrendatario</p>
            </div>
          )}
        </div>
  
        {/* Fila inferior: Vehículo */}
        {showCalificarVehiculo && (
          <div
            className="w-64 h-40 bg-black text-white hover:bg-gray-900 text-white rounded-xl p-6 text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
            onClick={() => router.push("/calificaciones/calificacionesAlVehiculo")}
          >
            <Star className="mx-auto mb-3 h-10 w-10" />
            <p className="text-lg font-semibold">Calificar Vehículo</p>
          </div>
        )}
      </div>
    </div>
  )
  
}

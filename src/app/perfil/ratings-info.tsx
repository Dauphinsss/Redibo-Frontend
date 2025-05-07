"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/utils/bakend"

interface UserProfile {
  roles: string[];
}

export function RatingsInfo() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div>Cargando calificaciones...</div>
  }

  const showRenterButtons = userData?.roles?.includes("RENTER")
  const showHostButtons = userData?.roles?.includes("HOST")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Calificaciones</h2>
        <p className="text-gray-500 mb-6">
          Califica tu experiencia con otros usuarios y vehículos
        </p>

        <div className="grid gap-4">
          {showRenterButtons && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full md:w-auto"
                onClick={() => {
                  // Implementar lógica de calificación
                  console.log("Calificar propietario")
                }}
              >
                <Star className="h-4 w-4" />
                Calificar Propietario
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 w-full md:w-auto"
                onClick={() => {
                  // Implementar lógica de calificación
                  console.log("Calificar vehículo")
                }}
              >
                <Star className="h-4 w-4" />
                Calificar Vehículo
              </Button>
            </>
          )}

          {showHostButtons && (
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={() => {
                // Implementar lógica de calificación
                console.log("Calificar arrendatario")
              }}
            >
              <Star className="h-4 w-4" />
              Calificar Arrendatario
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

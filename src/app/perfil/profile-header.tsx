"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner";
import { MoreHorizontal, User, Car, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"
import { API_URL } from "@/utils/bakend"

interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  fecha_nacimiento: Date;
  genero: string;
  telefono: string;
  foto: string;
  ciudad: {
    id: number;
    nombre: string;
  };
  roles: string[];
}

const RoleIcon = ({ role }: { role: string }) => {
  switch (role) {
    case 'HOST':
      return <Home className="h-5 w-5 text-blue-600" aria-label="Propietario" />
    case 'RENTER':
      return <User className="h-5 w-5 text-green-600" aria-label="Arrendatario" />
    case 'DRIVER':
      return <Car className="h-5 w-5 text-purple-600" aria-label="Conductor" />
    default:
      return null
  }
}

export function ProfileHeader() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

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

        console.log("Roles del usuario:", response.data.roles)
        setUserData(response.data)
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleAddRole = async (nuevoRol: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        console.error("Token no encontrado.")
        return
      }

      const response = await axios.post(`${API_URL}/api/add-rol`,
        { rol: nuevoRol },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("Rol agregado:", response.data.roles)
      toast.success("Rol agregado exitosamente.")
      // Refrescar los roles localmente
      setUserData((prev) =>
        prev ? { ...prev, roles: [...prev.roles, nuevoRol] } : prev
      )
    } catch (error: any) {
      console.error("Error al agregar rol:", error.response?.data || error.message)
      alert(error.response?.data?.error || "Error al agregar el rol.")
    }
  }

  if (loading) {
    return <div>Cargando perfil...</div>
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {userData?.foto && !imageError ? (
            <Image
              src={userData.foto}
              alt="Foto de perfil"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <User size={64} className="text-gray-400" />
          )}
        </div>
      </div>
  
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{userData?.nombre || "Usuario"}</h1>
  
        {userData?.roles && userData.roles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {userData.roles.map((rol, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
              >
                <RoleIcon role={rol} />
                <span className="text-sm font-medium">{rol}</span>
              </div>
            ))}
  
          {userData?.roles.length < 3 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-black text-white rounded-full p-2 hover:bg-gray-800 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["HOST", "RENTER", "DRIVER"]
                .filter((rol) => !userData.roles.includes(rol))
                .map((rol) => (
                  <DropdownMenuItem
                    key={rol}
                    onClick={() => handleAddRole(rol)}
                  >
                    Conviértete en {rol}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

          </div>
        )}
  
        {userData?.ciudad && (
          <p className="text-sm text-gray-600 mt-2">
            Ciudad: {userData.ciudad.nombre}
          </p>
        )}
      </div>
    </div>
  )
  
}

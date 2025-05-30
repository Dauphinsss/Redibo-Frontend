"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/ui/Header"
import { Footer } from "@/components/ui/footer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { API_URL } from "@/utils/bakend"
import Link from "next/link"

interface Usuario {
  id: number
  nombre: string
  correo: string
  telefono: string
  foto: string
}

interface Carro {
  id: number
  marca: string
  modelo: string
  Imagen: {
    data: string
  }[]
}

interface Reserva {
  id: number
  fecha_inicio: Date
  fecha_fin: Date
  estado: "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA"
  Usuario: Usuario
  Carro: Carro
}

export default function ActividadVehiclesPage() {
  const [reservaciones, setReservaciones] = useState<Reserva[]>([])
  const [registrosPorPagina, setRegistrosPorPagina] = useState("5")
  const [paginaActual, setPaginaActual] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalReservaciones, setTotalReservaciones] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>("")

  useEffect(() => {
   
    const token = localStorage.getItem("auth_token")
    if (token) {
      const fetchUserId = async () => {
        try {
          const response = await fetch(`${API_URL}/api/perfil`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUserId(userData.id.toString())
          } else {
            console.error("Error al obtener el perfil del usuario")
            setError("No se pudo obtener la información del usuario")
          }
        } catch (error) {
          console.error("Error al obtener el ID del usuario:", error)
          setError("Error de conexión al obtener datos del usuario")
        }
      }

      fetchUserId()
    } else {
      setError("No hay sesión activa. Por favor, inicie sesión nuevamente.")
    }
  }, [])

  const cargarReservaciones = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      
      let apiUrl = `${API_URL}/api/reservas?hostId=${userId}&page=${paginaActual}&limit=${registrosPorPagina}`;


      if (filtroEstado) {
           apiUrl = `${apiUrl}&estado=${filtroEstado}`;
      }

      const response = await fetch(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Datos de reserva recibidos del backend:", data); 

      
      if (data && Array.isArray(data.reservas)) {
        setReservaciones(data.reservas)
        setTotalReservaciones(data.total)
      } else {
         console.error("Formato de respuesta inesperado del backend para /api/reservas:", data);
         setReservaciones([]);
         setTotalReservaciones(0);
         
      }

    } catch (error: unknown) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(`No se pudieron cargar las reservaciones: ${errorMessage}`)
      toast.error("No se pudieron cargar las reservaciones")
    } finally {
      setIsLoading(false)
    }
  }, [userId, registrosPorPagina, paginaActual, filtroEstado])

  useEffect(() => {
    if (userId) {
      cargarReservaciones()
    }
  }, [userId, cargarReservaciones])

  const getVarianteBadge = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return "default"
      case "CONFIRMADA":
        return "secondary"
      case "EN_CURSO":
        return "secondary"
      case "CANCELADA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const totalPaginas = Math.ceil(totalReservaciones / Number.parseInt(registrosPorPagina))
  const indiceInicio = (paginaActual - 1) * Number.parseInt(registrosPorPagina)
  const indiceFin = Math.min(indiceInicio + Number.parseInt(registrosPorPagina), totalReservaciones)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-2xl font-bold mb-6">Actividad de mis vehículos</h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => cargarReservaciones()}>
              Intentar nuevamente
            </Button>
          </div>
        ) : reservaciones.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay vehículos rentados disponibles</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar</span>
                <Select
                  value={registrosPorPagina}
                  onValueChange={(value) => {
                    setRegistrosPorPagina(value)
                    setPaginaActual(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue>{registrosPorPagina}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">registros</span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">MARCA/MODELO</TableHead>
                    <TableHead className="font-semibold">CLIENTE</TableHead>
                    <TableHead className="font-semibold">CONTACTO</TableHead>
                    <TableHead className="font-semibold">FECHA INICIO</TableHead>
                    <TableHead className="font-semibold">FECHA FIN</TableHead>
                    <TableHead className="font-semibold">ESTADO</TableHead>
                    <TableHead className="font-semibold">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservaciones.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        {reserva.Carro.marca} {reserva.Carro.modelo}
                      </TableCell>
                      <TableCell>
                        {reserva.Usuario ? (
                          <Link href={`/usuario/${reserva.Usuario.id}`} className="hover:underline cursor-pointer">
                            {reserva.Usuario.nombre}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Sin datos</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{reserva.Usuario?.correo}</div>
                          <div className="text-muted-foreground">{reserva.Usuario?.telefono}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(reserva.fecha_fin).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVarianteBadge(reserva.estado)}>{reserva.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        {reserva.estado === "COMPLETADA" && (
                          <Link href={`/calificaciones/calificacionesAlRenter?reservaId=${reserva.id}`}>
                            <Button variant="outline" size="sm">
                              Calificar
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {indiceInicio + 1} a {indiceFin} de {totalReservaciones} reservaciones
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => prev - 1)}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </Button>
                <span className="px-3 py-2 rounded-md bg-primary text-primary-foreground">{paginaActual}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => prev + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
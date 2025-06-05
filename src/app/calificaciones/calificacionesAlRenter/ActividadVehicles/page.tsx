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
import { ArrowUp, ArrowDown } from "lucide-react"

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
  imagenes: {
    data: string
  }[]
}

interface Reserva {
  id: number
  fecha_inicio: string
  fecha_fin: string
  estado: "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA"
  Usuario: Usuario
  Carro: Carro
}

type SortDirection = "asc" | "desc"
type SortableField = "marca" | "modelo" | "nombre" | "correo" | "telefono" | "fecha_inicio" | "fecha_fin" | "estado"

export default function VehiclesRentadosPage() {
  const [reservaciones, setReservaciones] = useState<Reserva[]>([])
  const [allReservaciones, setAllReservaciones] = useState<Reserva[]>([])
  const [registrosPorPagina, setRegistrosPorPagina] = useState("5")
  const [paginaActual, setPaginaActual] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalReservaciones, setTotalReservaciones] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: SortableField
    direction: SortDirection
  }>({ key: "fecha_inicio", direction: "desc" })

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

      const response = await fetch(
        `${API_URL}/api/reservas/completadas?hostId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )


      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const reservas = data.reservas || data

      setAllReservaciones(reservas)
      setTotalReservaciones(reservas.length)

      const sorted = sortReservations(reservas, sortConfig.key, sortConfig.direction)
      setReservaciones(sorted.slice(0, Number(registrosPorPagina)))

    } catch (error: unknown) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(`No se pudieron cargar las reservaciones: ${errorMessage}`)
      toast.error("No se pudieron cargar las reservaciones")
    } finally {
      setIsLoading(false)
    }
  }, [userId, registrosPorPagina, sortConfig])

  useEffect(() => {
    if (userId) {
      cargarReservaciones()
    }
  }, [userId, cargarReservaciones])

  useEffect(() => {
    if (allReservaciones.length > 0) {
      const sorted = sortReservations(allReservaciones, sortConfig.key, sortConfig.direction)
      const startIndex = (paginaActual - 1) * Number(registrosPorPagina)
      const endIndex = startIndex + Number(registrosPorPagina)
      setReservaciones(sorted.slice(startIndex, endIndex))
    }
  }, [sortConfig, paginaActual, registrosPorPagina, allReservaciones])

  const sortReservations = (reservations: Reserva[], key: SortableField, direction: SortDirection): Reserva[] => {
    return [...reservations].sort((a, b) => {
      const valueA = getSortableValue(a, key)
      const valueB = getSortableValue(b, key)

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return direction === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime()
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc'
          ? valueA - valueB
          : valueB - valueA
      }
      return 0
    })
  }

  const getSortableValue = (reserva: Reserva, key: SortableField): string | Date | number => {
    switch (key) {
      case 'marca':
        return reserva.Carro.marca.toLowerCase()
      case 'modelo':
        return reserva.Carro.modelo.toLowerCase()
      case 'nombre':
        return reserva.Usuario.nombre.toLowerCase()
      case 'correo':
        return reserva.Usuario.correo.toLowerCase()
      case 'telefono':
        return reserva.Usuario.telefono
      case 'fecha_inicio':
        return new Date(reserva.fecha_inicio)
      case 'fecha_fin':
        return new Date(reserva.fecha_fin)
      case 'estado':
        return reserva.estado
      default:
        return ''
    }
  }

  const handleSort = (key: SortableField) => {
    let direction: SortDirection = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setPaginaActual(1)
  }

  const getSortIcon = (key: SortableField) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="ml-2 h-3 w-3" />
      : <ArrowDown className="ml-2 h-3 w-3" />
  }

  const getVarianteBadge = (estado: string) => {
    return "outline"
  }

  const totalPaginas = Math.ceil(totalReservaciones / Number(registrosPorPagina))
  const indiceInicio = (paginaActual - 1) * Number(registrosPorPagina) + 1
  const indiceFin = Math.min(indiceInicio + Number(registrosPorPagina) - 1, totalReservaciones)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-2xl font-bold mb-6">Vehículos Rentados</h1>

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
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("marca")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        MARCA/MODELO
                        {getSortIcon("marca")}
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("nombre")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        CLIENTE
                        {getSortIcon("nombre")}
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("correo")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        CONTACTO
                        {getSortIcon("correo")}
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("fecha_inicio")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        FECHA INICIO
                        {getSortIcon("fecha_inicio")}
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("fecha_fin")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        FECHA FIN
                        {getSortIcon("fecha_fin")}
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("estado")}
                        className="flex items-center px-0 hover:bg-transparent"
                      >
                        ESTADO
                        {getSortIcon("estado")}
                      </Button>
                    </TableHead>
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
                        <Badge
                          // variant={getVarianteBadge(reserva.estado)}
                          className="bg-white text-black border border-gray-300"
                        >
                          {reserva.estado.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reserva.estado === "COMPLETADA" && (
                          <Link href={`/calificaciones/calificacionesAlRenter?reservaId=${reserva.id}`}>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-black text-white hover:bg-gray-800"
                            >
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

              <div className="text-sm text-muted-foreground">
                Mostrando {indiceInicio} a {indiceFin} de {totalReservaciones} reservaciones
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </Button>

                {/* Mostrar números de página */}
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pageNum;
                  if (totalPaginas <= 5) {
                    pageNum = i + 1;
                  } else if (paginaActual <= 3) {
                    pageNum = i + 1;
                  } else if (paginaActual >= totalPaginas - 2) {
                    pageNum = totalPaginas - 4 + i;
                  } else {
                    pageNum = paginaActual - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={paginaActual === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaginaActual(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
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
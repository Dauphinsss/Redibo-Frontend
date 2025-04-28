"use client"
import { useCallback, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
/*import {useAuth} from "../context/AuthContext"*/
interface ProductosTableProps {
  hostId: number
}

interface Reservation {
  marca: string
  modelo: string
  nombre_usuario: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
  user_id: string
  [key: string]: string | number
}

export function ProductosTable({ hostId }: ProductosTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [totalReservations, setTotalReservations] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: string | null }>({
    key: null,
    direction: "ascending",
  })

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:4000/api/host-history?hostId=${hostId}&page=${currentPage}&limit=${itemsPerPage}`,
      )

      if (!response.ok) {
        throw new Error("Error al obtener las reservaciones")
      }
      const data = await response.json()
      setReservations(data.data)
      setTotalReservations(data.pagination.total)
    } catch (err) {
      const errorMessage = (err as Error)?.message || "An unexpected error occurred."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [hostId, currentPage, itemsPerPage])

  useEffect(() => {
    if (hostId) {
      fetchReservations()
    }
  }, [fetchReservations, hostId])

  // Función para manejar el ordenamiento
  const requestSort = (key: string) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Función para ordenar campos anidados (como marca y modelo)
  const sortedNestedReservations = [...reservations].sort((a, b) => {
    if (!sortConfig.key) return 0
    // Manejo especial para marca/modelo
    if (sortConfig.key === "marca_modelo") {
      const aValue = `${a.marca} ${a.modelo}`.toLowerCase()
      const bValue = `${b.marca} ${b.modelo}`.toLowerCase()
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    }

    // Manejo especial para fechas
    if (sortConfig.key.includes("fecha_")) {
      const aDate = new Date(a[sortConfig.key])
      const bDate = new Date(b[sortConfig.key])
      if (aDate < bDate) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aDate > bDate) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    }

    // Ordenamiento por defecto para otros campos
    const aValue = a[sortConfig.key]?.toString().toLowerCase()
    const bValue = b[sortConfig.key]?.toString().toLowerCase()
    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Paginación
  const totalPages = Math.ceil(totalReservations / itemsPerPage)

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Mapeo de estados a colores
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada":
        return "bg-blue-100 text-blue-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Componente para el indicador de ordenación
  const SortIndicator = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey)
      return (
        <span className="ml-1 opacity-0">
          <ChevronUp size={14} />
        </span>
      )
    return (
      <span className="ml-1">
        {sortConfig.direction === "ascending" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </span>
    )
  }

  // Función para manejar el clic en el nombre del cliente
  const handleClientClick = (userId: string) => {
    // Use Next.js router for programmatic navigation
    localStorage.setItem("access", "valid");
    router.push(`/historia1/${userId}?access=valid`)
  }

  if (loading) return <div className="text-center py-8">Cargando historial...</div>
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("marca_modelo")}
              >
                <div className="flex items-center">
                  Marca/Modelo
                  <SortIndicator columnKey="marca_modelo" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("nombre_usuario")}
              >
                <div className="flex items-center">
                  Cliente
                  <SortIndicator columnKey="nombre_usuario" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("fecha_inicio")}
              >
                <div className="flex items-center">
                  Fecha Inicio
                  <SortIndicator columnKey="fecha_inicio" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("fecha_fin")}
              >
                <div className="flex items-center">
                  Fecha Fin
                  <SortIndicator columnKey="fecha_fin" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("estado")}
              >
                <div className="flex items-center">
                  Estado
                  <SortIndicator columnKey="estado" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedNestedReservations.map((reserva, index) => (
              <tr
                key={`${reserva.marca}-${reserva.modelo}-${reserva.fecha_inicio}-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {reserva.marca} {reserva.modelo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  <button
                    onClick={() => handleClientClick(reserva.user_id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  >
                    {reserva.nombre_usuario}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(reserva.fecha_inicio)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(reserva.fecha_fin)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(reserva.estado)}`}
                  >
                    {reserva.estado.toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación y registros por página */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selector de items por página */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">registros</span>
        </div>

        {/* Info de paginación */}
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalReservations)}</span> de{" "}
          <span className="font-medium">{totalReservations}</span> reservaciones
        </div>

        {/* Controles de paginación */}
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${currentPage === 1 ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

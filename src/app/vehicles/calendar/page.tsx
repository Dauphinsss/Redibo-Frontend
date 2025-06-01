"use client"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_URL } from "@/utils/bakend"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Vehicle {
    id: number
    marca: string
    modelo: string
    año: number
    placa: string
    estado: string
    precio_por_dia: number
    calificacionpromedio?: number
    NumeroViajes?: number
    ingresoTotal?: number
    disponible_desde?: string | null
    disponible_hasta?: string | null
    imagen: string
}

interface Reservation {
    id: number
    id_carro: number
    estado: string
    fecha_inicio: string
    fecha_fin: string
    usuario?: {
        nombre: string
        telefono: string
    }
}

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export default function VehicleCalendarView() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
    const [selectedVehicle, setSelectedVehicle] = useState<string>("all")
    const [calendarDays, setCalendarDays] = useState<Date[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    const currentYear = new Date().getFullYear()
    const monthNumber = parseInt(selectedMonth)

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

    const filteredVehicles = selectedVehicle === "all"
        ? vehicles
        : vehicles.filter(v => v.id.toString() === selectedVehicle)

    useEffect(() => {
        const daysInMonth = new Date(currentYear, monthNumber + 1, 0).getDate()
        const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, monthNumber, i + 1))
        setCalendarDays(days)
    }, [monthNumber, currentYear])

    useEffect(() => {
        if (!userId) return

        const fetchCalendarData = async () => {
            setIsLoading(true)
            try {
                const token = localStorage.getItem("auth_token")
                if (!token) {
                    throw new Error("No se encontró token de autenticación")
                }

                const response = await fetch(`${API_URL}/api/calendar?month=${selectedMonth}&year=${currentYear}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Error al obtener datos del calendario')
                }

                const data = await response.json()
                
                const formattedVehicles = data.vehicles.map((v: any) => ({
                    ...v,
                    disponible_desde: v.disponible_desde ? new Date(v.disponible_desde) : null,
                    disponible_hasta: v.disponible_hasta ? new Date(v.disponible_hasta) : null
                }))

                const formattedReservations = data.reservations.map((r: any) => ({
                    ...r,
                    fecha_inicio: new Date(r.fecha_inicio),
                    fecha_fin: new Date(r.fecha_fin)
                }))

                setVehicles(formattedVehicles)
                setReservations(formattedReservations)
            } catch (error) {
                console.error('Error:', error)
                setError('No se pudieron cargar los datos del calendario')
                toast.error('No se pudieron cargar los datos del calendario')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCalendarData()
    }, [userId, selectedMonth, currentYear])

    const getStatusForDay = (vehicleId: number, day: Date) => {
        const reservation = reservations.find(r => {
            const start = new Date(r.fecha_inicio)
            const end = new Date(r.fecha_fin)
            start.setHours(0, 0, 0, 0)
            end.setHours(0, 0, 0, 0)
            return r.id_carro === vehicleId && day >= start && day <= end
        })

        if (reservation) {
            return {
                status: reservation.estado === "confirmada" ? "reservado" : "pendiente",
                reservation
            }
        }

        const vehicle = vehicles.find(v => v.id === vehicleId)
        if (!vehicle) return { status: "disponible" } // Si no encontramos el vehículo, lo consideramos disponible

        if (vehicle.estado === "mantenimiento") return { status: "mantenimiento" }

        // Si no hay restricciones de disponibilidad, está disponible
        return { status: "disponible" }
    }

    // Configuración simplificada a solo 4 estados
    const statusConfig = {
        disponible: { color: "bg-green-500", text: "Disponible" },
        reservado: { color: "bg-primary", text: "Reservado" },
        pendiente: { color: "bg-gray-500", text: "Pendiente" },
        mantenimiento: { color: "bg-destructive", text: "Mantenimiento" }
    }

    if (isLoading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Calendario de Vehículos</h1>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Calendario de Vehículos</h1>
                <div className="text-center py-8 text-destructive">
                    {error}
                </div>
            </div>
        )
    }

    if (vehicles.length === 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Calendario de Vehículos</h1>
                <div className="text-center py-8 text-gray-500">
                    No hay vehículos disponibles para mostrar en el calendario.
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Calendario de Vehículos</h1>

            <div className="bg-white rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="w-full md:w-1/2">
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-1/2">
                            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los vehículos</SelectItem>
                                    {vehicles.map((vehicle) => (
                                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                            {vehicle.marca} {vehicle.modelo} ({vehicle.placa})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(statusConfig).map(([key, { color, text }]) => (
                            <div key={key} className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                                <span className="text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs font-medium text-gray-500 bg-gray-50">
                                <th className="sticky left-0 bg-gray-50 z-10 p-3 text-left min-w-[180px]">Vehículo</th>
                                {calendarDays.map(day => (
                                    <th key={day.getTime()} className="p-3 text-center min-w-[40px]">
                                        <div className="font-semibold">{day.getDate()}</div>
                                        <div className="text-xs">{day.toLocaleDateString("es-ES", { weekday: "short" })}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="border-t">
                                        <td className="sticky left-0 bg-white z-10 p-3 border-r">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100">
                                                    <img
                                                        src={vehicle.imagen || "/placeholder-car.jpg"}
                                                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{vehicle.marca} {vehicle.modelo}</div>
                                                    <div className="text-xs text-gray-500">{vehicle.placa}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {calendarDays.map(day => {
                                            const { status, reservation } = getStatusForDay(vehicle.id, day)
                                            const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-200', text: 'Disponible' }
                                            
                                            return (
                                                <td key={day.getTime()} className="p-0 text-center border-r border-b">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="h-full w-full p-2">
                                                                    <div className={`w-full h-4 rounded-sm ${config.color}`}></div>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="p-2">
                                                                    <p className="font-semibold">{config.text}</p>
                                                                    {reservation && (
                                                                        <>
                                                                            {reservation.usuario ? (
                                                                                <>
                                                                                    <p className="text-sm">Cliente: {reservation.usuario.nombre}</p>
                                                                                    <p className="text-sm">Teléfono: {reservation.usuario.telefono}</p>
                                                                                </>
                                                                            ) : (
                                                                                <p className="text-sm">Información de cliente no disponible</p>
                                                                            )}
                                                                            <p className="text-sm">
                                                                                {new Date(reservation.fecha_inicio).toLocaleDateString()} -{" "}
                                                                                {new Date(reservation.fecha_fin).toLocaleDateString()}
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={calendarDays.length + 1} className="py-8 text-center text-gray-500">
                                        No hay vehículos que coincidan con los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
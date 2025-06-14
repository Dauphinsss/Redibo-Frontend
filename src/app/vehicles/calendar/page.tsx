"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_URL } from "@/utils/bakend"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VehicleResponse {
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

interface ReservationResponse {
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

const weekdaysShort = ["Dom.", "Lun.", "Mar.", "Miérc.", "Juev.", "Vier.", "Sáb."]

const statusConfig = {
    disponible: { color: "bg-green-500", text: "Disponible" },
    reservado: { color: "bg-primary", text: "Reservado" },
    pendiente: { color: "bg-gray-500", text: "Pendiente" },
    mantenimiento: { color: "bg-destructive", text: "Mantenimiento" }
}

export default function VehicleCalendarView() {
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
    const [reservations, setReservations] = useState<ReservationResponse[]>([])
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const savedMonth = localStorage.getItem('calendarSelectedMonth')
            return savedMonth || new Date().getMonth().toString()
        }
        return new Date().getMonth().toString()
    })
    const [selectedVehicle, setSelectedVehicle] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const savedVehicle = localStorage.getItem('calendarSelectedVehicle')
            return savedVehicle || "all"
        }
        return "all"
    })
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [calendarDays, setCalendarDays] = useState<Date[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [showScrollArrows, setShowScrollArrows] = useState({
        left: false,
        right: true
    })

    const currentYear = new Date().getFullYear()
    const monthNumber = parseInt(selectedMonth)

    const getStatusForDay = useCallback((vehicleId: number, day: Date) => {
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
        if (!vehicle) return { status: "disponible" }

        if (vehicle.estado === "mantenimiento") return { status: "mantenimiento" }

        return { status: "disponible" }
    }, [reservations, vehicles])

    const filteredVehicles = (selectedVehicle === "all" 
        ? vehicles 
        : vehicles.filter(v => v.id.toString() === selectedVehicle))
    .filter(vehicle => {
        if (selectedStatuses.length === 0) return true
        
        return calendarDays.some(day => {
            const { status } = getStatusForDay(vehicle.id, day)
            return selectedStatuses.includes(status)
        })
    })

    useEffect(() => {
        localStorage.setItem('calendarSelectedMonth', selectedMonth)
        localStorage.setItem('calendarSelectedVehicle', selectedVehicle)
    }, [selectedMonth, selectedVehicle])

    useEffect(() => {
        const daysInMonth = new Date(currentYear, monthNumber + 1, 0).getDate()
        const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, monthNumber, i + 1))
        setCalendarDays(days)
    }, [monthNumber, currentYear])

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
                
                const formattedVehicles = data.vehicles.map((v: VehicleResponse) => ({
                    ...v,
                    disponible_desde: v.disponible_desde ? new Date(v.disponible_desde) : null,
                    disponible_hasta: v.disponible_hasta ? new Date(v.disponible_hasta) : null
                }))

                const formattedReservations = data.reservations.map((r: ReservationResponse) => ({
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

    const checkScroll = useCallback(() => {
        if (tableContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current
            setShowScrollArrows({
                left: scrollLeft > 10,
                right: scrollLeft < scrollWidth - clientWidth - 10
            })
        }
    }, [])

    const scrollTable = useCallback((direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const scrollAmount = 300
            tableContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }, [])

    useEffect(() => {
        const table = tableContainerRef.current
        if (!table) return

        table.addEventListener('scroll', checkScroll)
        const resizeObserver = new ResizeObserver(checkScroll)
        resizeObserver.observe(table)

        return () => {
            table.removeEventListener('scroll', checkScroll)
            resizeObserver.disconnect()
        }
    }, [checkScroll])

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status) 
                : [...prev, status]
        )
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full sm:w-[180px]">
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
                        
                        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                            <SelectTrigger className="w-full sm:w-[200px]">
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
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {Object.entries(statusConfig).map(([key, { color, text }]) => (
                            <button
                                key={key}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${selectedStatuses.includes(key) ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                onClick={() => handleStatusToggle(key)}
                            >
                                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                                <span className="text-xs sm:text-sm text-gray-600">{text}</span>
                                {selectedStatuses.includes(key) && (
                                    <span className="text-xs text-gray-500 ml-1">✓</span>
                                )}
                            </button>
                        ))}
                        {selectedStatuses.length > 0 && (
                            <button
                                className="text-xs text-primary hover:underline"
                                onClick={() => setSelectedStatuses([])}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative p-4">
                    <div className="relative px-10">
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-1 transition-opacity duration-300 ${!showScrollArrows.left && 'opacity-0 pointer-events-none'}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() => scrollTable('left')}
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-700" />
                            </Button>
                        </div>

                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 mr-1 transition-opacity duration-300 ${!showScrollArrows.right && 'opacity-0 pointer-events-none'}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() => scrollTable('right')}
                            >
                                <ChevronRight className="h-5 w-5 text-gray-700" />
                            </Button>
                        </div>

                        <div 
                            ref={tableContainerRef}
                            className="overflow-x-auto pb-4 scrollbar-hide"
                        >
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs font-medium text-gray-500 bg-gray-50">
                                        <th className="sticky left-0 bg-gray-50 z-10 p-3 text-left min-w-[180px]">Vehículo</th>
                                        {calendarDays.map(day => (
                                            <th key={day.getTime()} className="p-3 text-center w-[40px]">
                                                <div className="font-semibold">{day.getDate()}</div>
                                                <div className="text-xs">{weekdaysShort[day.getDay()]}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVehicles.length > 0 ? (
                                        filteredVehicles.map(vehicle => (
                                            <tr key={vehicle.id} className="border-t">
                                                <td className="sticky left-0 bg-white z-10 p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 relative">
                                                            <Image
                                                                src={vehicle.imagen || "/images/Auto_default.png"}
                                                                alt={`${vehicle.marca} ${vehicle.modelo}`}
                                                                width={40}
                                                                height={40}
                                                                style={{ objectFit: "cover", borderRadius: 8, display: 'block', width: '100%', height: '100%' }}
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
                                                    const shouldHighlight = selectedStatuses.length === 0 || selectedStatuses.includes(status)
                                                    const opacityClass = shouldHighlight ? 'opacity-100' : 'opacity-30'
                                                    
                                                    return (
                                                        <td key={day.getTime()} className="p-2 text-center w-[40px]">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="h-8 w-full flex items-center justify-center">
                                                                            <div className={`w-full h-4 rounded ${config.color} ${opacityClass}`}></div>
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
            </div>
        </div>
    )
}
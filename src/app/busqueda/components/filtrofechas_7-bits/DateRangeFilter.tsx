'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode'

interface Props {
  searchTerm: string
  fechaInicio: string
  fechaFin: string
  setFechaInicio: (fecha: string) => void
  setFechaFin: (fecha: string) => void
  autosActuales: Auto[]
  autosTotales: Auto[]
  onAplicarFiltro: (inicio: string, fin: string) => void
}

const DateRangeFilter: React.FC<Props> = ({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  searchTerm,
  autosActuales,
  autosTotales,
  onAplicarFiltro,
}) => {
  const todayLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString().split("T")[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="font-semibold text-sm">
          Filtrar por Fechas
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-4 space-y-3">
        <h2 className="text-sm font-semibold">Disponibilidad del Vehículo</h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Fecha Inicio</label>
          <input
            type="date"
            min={todayLocal}
            value={fechaInicio}
            onChange={(e) => {
              const nueva = e.target.value
              setFechaInicio(nueva)
              if (fechaFin && new Date(nueva) > new Date(fechaFin)) {
                setFechaFin("")
              }
            }}
            className="border px-2 py-1 rounded text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Fecha Fin</label>
          <input
            type="date"
            min={fechaInicio || todayLocal}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
        </div>

        <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 whitespace-nowrap">
          Mostrando {autosActuales.length} de {autosTotales.length} resultados
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangeFilter

'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode'
import { useCallback, useEffect, useState } from "react"

interface Props {
  autosActuales: Auto[]
  setAutosFiltrados: (autos: Auto[]) => void
}

const DateRangeFilter: React.FC<Props> = ({
  autosActuales,
  setAutosFiltrados,
}) => {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const todayLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString().split("T")[0]

  const aplicarFiltro = useCallback(() => {
    if (!fechaInicio && !fechaFin) {
      return autosActuales;
    }
    return autosActuales.filter(auto => {

      if (!auto.reservas || auto.reservas.length === 0) return true;

      const filtroInicio = fechaInicio ? new Date(fechaInicio) : null;
      const filtroFin = fechaFin ? new Date(fechaFin) : null;

      return !auto.reservas.some(reserva => {
        if (!['PENDIENTE', 'CONFIRMADA', 'COMPLETADA'].includes(reserva.estado)) return false;

        const inicioReserva = new Date(reserva.fecha_inicio);
        const finReserva = new Date(reserva.fecha_fin);

        if (filtroInicio && !filtroFin) {
          return finReserva >= filtroInicio;
        }

        if (!filtroInicio && filtroFin) {
          return inicioReserva <= filtroFin;
        }

        if (filtroInicio && filtroFin) {
          return (
            inicioReserva <= filtroFin &&
            finReserva >= filtroInicio
          );
        }
        return false;
      });
    });
  }, [fechaInicio, fechaFin, autosActuales]);

  const handleFiltrar = () => {
    const resultado = aplicarFiltro();
    setAutosFiltrados(resultado);
  };

  const handleLimpiar = () => {
    setFechaInicio("");
    setFechaFin("");
    setAutosFiltrados(autosActuales);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="font-semibold text-sm">
          Filtrar por Fechas
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[220px] p-4 space-y-3"
        onInteractOutside={handleFiltrar}
      >
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
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleFiltrar}
            className="flex-1 cursor-pointer"
          >
            Aplicar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLimpiar}
            disabled={!fechaInicio && !fechaFin}
            className="cursor-pointer"
          >
            Limpiar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangeFilter

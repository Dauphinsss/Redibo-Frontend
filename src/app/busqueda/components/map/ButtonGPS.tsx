"use client"

import * as React from "react"
import { Map } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Radio from "@/app/busqueda/components/map/Radio"

interface ButtonGPSProps {
  gpsActive: boolean
  onGpsToggle: () => void
  radio: number
  setRadio: (value: number | ((prev: number) => number)) => void
}

export function ButtonGPS({ gpsActive, onGpsToggle, radio, setRadio }: ButtonGPSProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={gpsActive ? "default" : "outline"} className="flex items-center gap-2">
          <Map size={18} />
          GPS: {gpsActive ? `${radio} km` : 'Desactivado'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-1">
        <Radio radio={radio} setRadio={setRadio} punto={{ lon: 1, alt: 1 }} />
        <div className="flex justify-center">
          <Button size="sm" onClick={onGpsToggle}>
            {gpsActive ? "Desactivar GPS" : "Activar GPS"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFakeAuth } from "./hooks/useFakeAuth";
import { useState } from "react";

export default function ProvisionalBooking() {
  const { user, login } = useFakeAuth(); //hooks loggin
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  const clearPickupDate = () => setPickupDate(undefined);
  const clearReturnDate = () => setReturnDate(undefined);

  //conditional for loggin (redireccionar??o no)
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 max-w-md">
        <p className="text-center">
          Por favor, inicia sesión para hacer una reserva.
        </p>
        <Button onClick={login}>Iniciar sesión</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md h-auto flex flex-col items-start gap-4 p-4 border border-gray-300 rounded-xl bg-white shadow-md">
      <div className="w-full bg-[#000000] text-white text-center py-2 rounded-md">
        <h2 className="text-lg font-semibold">Elige una fecha</h2>
      </div>
      <div className="flex gap-4">
        {/* Botón fecha de Recogida */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto h-auto justify-start text-left font-normal border border-gray-500"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Fecha de recogida</span>
                <span>
                  {pickupDate
                    ? format(pickupDate, "dd '/' MMMM '/' yyyy", { locale: es })
                    : "Agrega una Fecha"}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={setPickupDate}
              initialFocus
              locale={es}
              disabled={{ before: new Date() }}
            />
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPickupDate}
                className="w-full flex items-center justify-center text-red-500"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar fecha
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Botón de Devolución */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto h-auto justify-start text-left font-normal border-gray-500"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Fecha de devolución</span>
                <span>
                  {returnDate
                    ? format(returnDate, "dd '/' MMMM '/' yyyy", { locale: es })
                    : "Agrega una Fecha"}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              initialFocus
              locale={es}
              disabled={{ before: pickupDate || new Date() }}
            />
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearReturnDate}
                className="w-full flex items-center justify-center text-red-500"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar fecha
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex justify-center mt-6">
        {/*} <ReservationConfirmedMessage
          user={user}
          pickupDate={pickupDate}
          returnDate={returnDate}
        />*/}
      </div>
      {/*<Button variant="destructive" onClick={logout} className="mt-4">Cerrar sesión</Button>*/}
    </div>
  );
}
